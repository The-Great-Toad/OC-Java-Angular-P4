package com.openclassrooms.starterjwt.integration;

import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for authentication (Auth).
 * These tests validate the complete flow of registration, login, and JWT generation.
 */
@DisplayName("Integration Tests - Authentication")
class AuthenticationIT extends ITUtils {

	private SignupRequest signupRequest;
	private LoginRequest loginRequest;

	@BeforeEach
	void setUp() {
		signupRequest = getSignupRequest();
		loginRequest = getLoginRequest();
	}

	@AfterEach
	void tearDown() {
        userRepository.deleteAll();
	}

	@Test
	@DisplayName("Should allow registration of a new user")
	void shouldRegisterNewUser() throws Exception {
		register();

		assertThat(userRepository.existsByEmail(USER_IT_EMAIL)).isTrue();
	}

	@Test
	@DisplayName("Should fail to register with an existing email")
	void shouldFailToRegisterWithExistingEmail() throws Exception {
		register();

		mockMvc.perform(post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(signupRequest)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Error: Email is already taken!"));
	}

	@Test
	@DisplayName("Should fail to register with invalid data")
	void shouldFailToRegisterWithInvalidData() throws Exception {
		signupRequest.setEmail("invalid-email");

		mockMvc.perform(post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(signupRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	@DisplayName("Should allow login of a registered user")
	void shouldLoginRegisteredUser() throws Exception {
		register();

		mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").isNotEmpty())
				.andExpect(jsonPath("$.type").value("Bearer"))
				.andExpect(jsonPath("$.username").value(USER_IT_EMAIL))
				.andExpect(jsonPath("$.firstName").value(signupRequest.getFirstName()))
				.andExpect(jsonPath("$.lastName").value(signupRequest.getLastName()))
				.andExpect(jsonPath("$.admin").value(false));
	}

	@Test
	@DisplayName("Should fail to login with a wrong password")
	void shouldFailToLoginWithWrongPassword() throws Exception {
		register();
		loginRequest.setPassword("wrongPassword");

		mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	@DisplayName("Should fail to login with a non-existent email")
	void shouldFailToLoginWithNonExistentEmail() throws Exception {
		loginRequest.setEmail("nonexistent@yoga.com");
		mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	@DisplayName("Should generate a valid JWT on successful login")
	void shouldGenerateValidJwtOnSuccessfulLogin() throws Exception {
		register();

		MvcResult loginResult = mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").isNotEmpty())
				.andExpect(jsonPath("$.type").value("Bearer"))
				.andReturn();

		String responseBody = loginResult.getResponse().getContentAsString();
		assertThat(responseBody)
                .contains("token")
                .contains("Bearer");
	}

	@Test
	@DisplayName("Should correctly identify an admin user")
	void shouldIdentifyAdminUser() throws Exception {
		LoginRequest adminLogin = getAdminLoginRequest();

		mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(adminLogin)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").isNotEmpty())
				.andExpect(jsonPath("$.admin").value(true))
				.andExpect(jsonPath("$.username").value(adminLogin.getEmail()));
	}

	@Test
	@DisplayName("Complete flow: Register - login - generate valid JWT")
	void shouldCompleteFullAuthenticationFlow() throws Exception {
        userRepository.deleteAll();
        assertThat(userRepository.count()).isZero();

		register();
		assertThat(userRepository.existsByEmail(USER_IT_EMAIL)).isTrue();

		MvcResult loginResult = mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest)))
                .andDo(print())
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").isNotEmpty())
				.andExpect(jsonPath("$.type").value("Bearer"))
				.andExpect(jsonPath("$.username").value(USER_IT_EMAIL))
				.andExpect(jsonPath("$.firstName").value(signupRequest.getFirstName()))
				.andExpect(jsonPath("$.lastName").value(signupRequest.getLastName()))
				.andExpect(jsonPath("$.admin").value(false))
				.andReturn();

		String responseBody = loginResult.getResponse().getContentAsString();
		assertThat(responseBody)
                .contains("token")
                .contains("Bearer");
	}

    /** Registers a new user for testing. */
    private void register() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));
    }
}
