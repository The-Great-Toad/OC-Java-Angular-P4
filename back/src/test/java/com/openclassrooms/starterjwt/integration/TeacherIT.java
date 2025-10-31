package com.openclassrooms.starterjwt.integration;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for teacher management.
 * These tests validate teacher retrieval operations and authentication requirements.
 */
@DisplayName("Integration Tests - Teachers")
class TeacherIT extends ITUtils {

    private User testUser;
    private String testToken;
    private Teacher teacher1;

    @BeforeEach
    void setUp() {
        // Create test user for authentication
        testUser = createUser("testuser@yoga.com");

        // Generate JWT token
        testToken = generateToken(testUser.getEmail());

        // Create test teachers
        teacher1 = createTeacher("John", "Doe");
    }

    @AfterEach
    void tearDown() {
        cleanDatabase();
    }

    @Nested
    @DisplayName("findByIdTest")
    class findByIdTest {
        @Test
        @DisplayName("Should retrieve teacher by ID when authenticated")
        void shouldRetrieveTeacherByIdWhenAuthenticated() throws Exception {
            mockMvc.perform(get("/api/teacher/" + teacher1.getId())
                            .header("Authorization", "Bearer " + testToken))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(teacher1.getId()))
                    .andExpect(jsonPath("$.firstName").value("John"))
                    .andExpect(jsonPath("$.lastName").value("Doe"));
        }

        @Test
        @DisplayName("Should return 404 when teacher ID does not exist")
        void shouldReturn404WhenTeacherNotFound() throws Exception {
            mockMvc.perform(get("/api/teacher/9999")
                            .header("Authorization", "Bearer " + testToken))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("Should return 400 for invalid teacher ID format")
        void shouldReturn400ForInvalidTeacherIdFormat() throws Exception {
            mockMvc.perform(get("/api/teacher/invalid-id")
                            .header("Authorization", "Bearer " + testToken))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return 401 when accessing teacher without authentication")
        void shouldReturn401WhenAccessingTeacherWithoutAuth() throws Exception {
            mockMvc.perform(get("/api/teacher/" + teacher1.getId()))
                    .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("findAllTest")
    class findAllTest {
        @Test
        @DisplayName("Should retrieve all teachers when authenticated")
        void shouldRetrieveAllTeachersWhenAuthenticated() throws Exception {
            Teacher teacher2 = createTeacher("Jane", "Smith");

            mockMvc.perform(get("/api/teacher")
                            .header("Authorization", "Bearer " + testToken))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(2))
                    .andExpect(jsonPath("$[0].firstName").value(teacher1.getFirstName()))
                    .andExpect(jsonPath("$[0].lastName").value(teacher1.getLastName()))
                    .andExpect(jsonPath("$[1].firstName").value(teacher2.getFirstName()))
                    .andExpect(jsonPath("$[1].lastName").value(teacher2.getLastName()));
        }

        @Test
        @DisplayName("Should return empty array when no teachers exist")
        void shouldReturnEmptyArrayWhenNoTeachersExist() throws Exception {
            cleanDatabase();
            createUser(testUser.getEmail());

            mockMvc.perform(get("/api/teacher")
                            .header("Authorization", "Bearer " + testToken))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(0));
        }

        @Test
        @DisplayName("Should return 401 when accessing all teachers without authentication")
        void shouldReturn401WhenAccessingAllTeachersWithoutAuth() throws Exception {
            mockMvc.perform(get("/api/teacher"))
                    .andExpect(status().isUnauthorized());
        }
    }
}
