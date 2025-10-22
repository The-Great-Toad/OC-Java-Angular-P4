package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.TestUtils;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class UserControllerTest extends TestUtils {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserMapper userMapper;
    @Mock
    private UserService userService;

    private MockMvc mockMvc;

    private static final String ID = "1";
    private static final String FIND_BY_ID_URL = "/api/user/{id}";
    private static final String DELETE_URL = "/api/user/{id}";

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Nested
    @DisplayName("findByIdTest")
    class findByIdTest {
        @Test
        void shouldReturnHttp200WhenUserIdIsValid() throws Exception {
            User user = getUser();
            UserDto userDto = getUserDto(user);


            when(userService.findById(anyLong())).thenReturn(user);
            when(userMapper.toDto(user)).thenReturn(userDto);

            mockMvc.perform(get(FIND_BY_ID_URL, ID))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(user.getId()))
                    .andExpect(jsonPath("$.firstName").value(userDto.getFirstName()))
                    .andExpect(jsonPath("$.lastName").value(userDto.getLastName()));

            verify(userService).findById(anyLong());
            verify(userMapper).toDto(user);
        }

        @Test
        void shouldReturnHttp404WhenUserIsNotFound() throws Exception {
            when(userService.findById(anyLong())).thenReturn(null);

            mockMvc.perform(get(FIND_BY_ID_URL, ID))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$").doesNotExist());

            verify(userService, times(1)).findById(anyLong());
            verify(userMapper, never()).toDto(any(User.class));
        }

        @Test
        void shouldReturnHttp400WhenInvalidPathVariableType() throws Exception {
            String invalidId = "invalid_id";

            mockMvc.perform(get(FIND_BY_ID_URL, invalidId))
                    .andDo(print())
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$").doesNotExist());

            verify(userService, never()).findById(anyLong());
            verify(userMapper, never()).toDto(any(User.class));

        }
    }

    @Nested
    @DisplayName("deleteTest")
    class deleteTest {
        @Test
        void shouldReturnHttp200WhenValidUserId() throws Exception {
            User user = getUser();
            SecurityContext securityContext = mock(SecurityContext.class);
            Authentication authentication = mock(Authentication.class);
            SecurityContextHolder.setContext(securityContext);

            when(userService.findById(anyLong())).thenReturn(user);
            when(securityContext.getAuthentication()).thenReturn(authentication);
            when(authentication.getPrincipal()).thenReturn(getUserDetailsImpl(user));

            mockMvc.perform(delete(DELETE_URL, ID))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").doesNotExist());

            verify(userService).findById(anyLong());
            verify(userService).delete(anyLong());
        }

        @Test
        void shouldReturnHttp404WhenSessionNotFound() throws Exception {

            when(userService.findById(anyLong())).thenReturn(null);

            mockMvc.perform(delete(DELETE_URL, ID))
                    .andDo(print())
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$").doesNotExist());

            verify(userService).findById(anyLong());
        }

        @Test
        void shouldReturnHttp400WhenInvalidPathVariableType() throws Exception {
            String invalidId = "invalid_id";

            mockMvc.perform(delete(DELETE_URL, invalidId))
                    .andDo(print())
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$").doesNotExist());
        }
    }
}