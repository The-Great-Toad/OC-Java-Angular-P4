package com.openclassrooms.starterjwt.security.services;

import com.openclassrooms.starterjwt.TestUtils;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest extends TestUtils {

    @InjectMocks
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Mock
    private UserRepository userRepository;

    @Nested
    @DisplayName("loadUserByUsernameTest")
    class loadUserByUsernameTest {
        @Test
        void shouldReturnUserDetails() {
            String username = "username";
            UserDetailsImpl expectedResult = getUserDetailsImpl(getUser());

            when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(getUser()));

            UserDetails result = userDetailsServiceImpl.loadUserByUsername(username);

            assertNotNull(result);
            assertEquals(expectedResult, result);
        }

        @Test
        void shouldThrowExceptionWhenUserNotFound() {
            String username = "username";
            String expectedMessage = "User Not Found with email: " + username;

            when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

            assertThatExceptionOfType(UsernameNotFoundException.class).isThrownBy(
                    () -> userDetailsServiceImpl.loadUserByUsername(username)
            ).withMessage(expectedMessage);
        }
    }
}