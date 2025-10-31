package com.openclassrooms.starterjwt.integration;

import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.test.context.support.WithMockUser;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for user management.
 * These tests validate user profile operations (GET, DELETE) and authorization rules.
 */
@DisplayName("Integration Tests - Users")
class UserIT extends ITUtils {

    private User testUser;
    private String testUserToken;

    @BeforeEach
    void setUp() {
        testUser = createUser("testuser@yoga.com");
        testUserToken = generateToken(testUser.getEmail());
    }

    @AfterEach
    void tearDown() {
        cleanDatabase();
    }

    /* FindByIdTest */

    @Test
    @DisplayName("Should get user by ID successfully")
    @WithMockUser(username = USER_TEST_EMAIL)
    void shouldGetUserById() throws Exception {
        mockMvc.perform(get("/api/user/" + testUser.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(testUser.getId().intValue())))
                .andExpect(jsonPath("$.email", is("testuser@yoga.com")))
                .andExpect(jsonPath("$.firstName", is("Test")))
                .andExpect(jsonPath("$.lastName", is("User")))
                .andExpect(jsonPath("$.admin", is(false)));
    }

    @Test
    @DisplayName("Should return 404 when user not found")
    @WithMockUser(username = USER_TEST_EMAIL)
    void shouldReturn404WhenUserNotFound() throws Exception {
        mockMvc.perform(get("/api/user/99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should return 400 for invalid user ID format")
    @WithMockUser(username = USER_TEST_EMAIL)
    void shouldReturn400ForInvalidIdFormat() throws Exception {
        mockMvc.perform(get("/api/user/invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return 401 when accessing user without authentication")
    void shouldReturn401WithoutAuthentication() throws Exception {
        mockMvc.perform(get("/api/user/" + testUser.getId()))
                .andExpect(status().isUnauthorized());
    }

    /* FindAllTest */

    @Test
    @DisplayName("Should delete own user account successfully")
    void shouldDeleteOwnAccount() throws Exception {
        mockMvc.perform(delete("/api/user/" + testUser.getId())
                        .header("Authorization", "Bearer " + testUserToken))
                .andExpect(status().isOk());

        // Verify user is deleted
        mockMvc.perform(get("/api/user/" + testUser.getId()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should return 401 when trying to delete another user's account")
    @WithMockUser(username = USER_TEST_EMAIL)
    void shouldReturn401WhenDeletingAnotherUsersAccount() throws Exception {
        mockMvc.perform(delete("/api/user/" + testUser.getId()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should return 404 when deleting non-existent user")
    @WithMockUser(username = USER_TEST_EMAIL)
    void shouldReturn404WhenDeletingNonExistentUser() throws Exception {
        mockMvc.perform(delete("/api/user/99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should return 400 for invalid ID format when deleting")
    @WithMockUser(username = USER_TEST_EMAIL)
    void shouldReturn400ForInvalidIdFormatWhenDeleting() throws Exception {
        mockMvc.perform(delete("/api/user/invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return 401 when deleting without authentication")
    void shouldReturn401WhenDeletingWithoutAuthentication() throws Exception {
        mockMvc.perform(delete("/api/user/" + testUser.getId()))
                .andExpect(status().isUnauthorized());
    }
}
