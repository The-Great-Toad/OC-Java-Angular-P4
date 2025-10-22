package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.TestUtils;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest extends TestUtils {

    @InjectMocks
    private AuthController authController;

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtUtils jwtUtils;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private UserRepository userRepository;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String LOGIN_URL = "/api/auth/login";
    private static final String REGISTER_URL = "/api/auth/register";
    private static final String TEST_JWT = "jwt.token.here";

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Nested
    @DisplayName("authenticateUserTests")
    class authenticateUserTests {
        @Test
        void shouldReturnHttp200WithJwtWhenCredentialsAreValid() throws Exception {
            User user = getUser();
            LoginRequest loginRequest = getLoginRequest(user.getEmail());
            UserDetailsImpl userDetails = getUserDetailsImpl(user);
            Authentication authentication = mock(Authentication.class);

            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(authentication);
            when(authentication.getPrincipal()).thenReturn(userDetails);
            when(jwtUtils.generateJwtToken(authentication)).thenReturn(TEST_JWT);
            when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

            mockMvc.perform(post(LOGIN_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").value(TEST_JWT))
                    .andExpect(jsonPath("$.id").value(userDetails.getId()))
                    .andExpect(jsonPath("$.username").value(userDetails.getUsername()))
                    .andExpect(jsonPath("$.firstName").value(userDetails.getFirstName()))
                    .andExpect(jsonPath("$.lastName").value(userDetails.getLastName()))
                    .andExpect(jsonPath("$.admin").value(user.isAdmin()));

            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
            verify(jwtUtils).generateJwtToken(authentication);
            verify(userRepository).findByEmail(user.getEmail());
        }

        @Test
        void shouldReturnAdminFalseWhenUserNotFoundInRepository() throws Exception {
            User user = getUser();
            LoginRequest loginRequest = getLoginRequest(user.getEmail());
            UserDetailsImpl userDetails = getUserDetailsImpl(user);
            Authentication authentication = mock(Authentication.class);

            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(authentication);
            when(authentication.getPrincipal()).thenReturn(userDetails);
            when(jwtUtils.generateJwtToken(authentication)).thenReturn(TEST_JWT);
            when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

            mockMvc.perform(post(LOGIN_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").value(TEST_JWT))
                    .andExpect(jsonPath("$.id").value(userDetails.getId()))
                    .andExpect(jsonPath("$.username").value(userDetails.getUsername()))
                    .andExpect(jsonPath("$.firstName").value(userDetails.getFirstName()))
                    .andExpect(jsonPath("$.lastName").value(userDetails.getLastName()))
                    .andExpect(jsonPath("$.admin").value(false));

            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
            verify(jwtUtils).generateJwtToken(authentication);
            verify(userRepository).findByEmail(user.getEmail());
        }
    }

    @Nested
    @DisplayName("registerUserTests")
    class registerUserTests {
        @Test
        void shouldReturnHttp200WithSuccessMessageWhenRegistrationIsValid() throws Exception {
            SignupRequest signupRequest = getSignupRequest(getUser());

            when(userRepository.existsByEmail(anyString())).thenReturn(false);
            when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(signupRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("User registered successfully!"));

            verify(userRepository).existsByEmail(signupRequest.getEmail());
            verify(passwordEncoder).encode(signupRequest.getPassword());
            verify(userRepository).save(any(User.class));
        }

        @Test
        void shouldReturnHttp400WhenEmailAlreadyExists() throws Exception {
            SignupRequest signupRequest = getSignupRequest(getUser());

            when(userRepository.existsByEmail(anyString())).thenReturn(true);

            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(signupRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));

            verify(userRepository).existsByEmail(signupRequest.getEmail());
            verify(userRepository, never()).save(any(User.class));
            verify(passwordEncoder, never()).encode(anyString());
        }
    }
}
