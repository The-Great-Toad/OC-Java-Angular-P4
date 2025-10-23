package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.TestUtils;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest extends TestUtils {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    private static final Long USER_ID = 1L;
    @Test
    void delete() {
        assertThatNoException().isThrownBy(() -> userService.delete(USER_ID));
    }

    @Nested
    @DisplayName("findByIdTest")
    class findByIdTest {
        @Test
        void shouldReturnUser() {
            User expectedUser = getUser();

            when(userRepository.findById(anyLong())).thenReturn(Optional.of(expectedUser));

            User result = userService.findById(USER_ID);

            assertNotNull(result);
            assertEquals(expectedUser, result);
        }

        @Test
        void whenUserNotFound_thenReturnNull() {
            when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

            assertNull(userService.findById(USER_ID));
        }
    }
}