package com.openclassrooms.starterjwt.integration;

import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.test.context.support.WithMockUser;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for teacher management.
 * These tests validate teacher retrieval operations and authentication requirements.
 */
@DisplayName("Integration Tests - Teachers")
class TeacherIT extends ITUtils {

    private Teacher teacher1;

    @BeforeEach
    void setUp() {
        teacher1 = createTeacher("John", "Doe");
    }

    @AfterEach
    void tearDown() {
        cleanDatabase();
    }

    /* FindByIdTest */

    @Test
    @DisplayName("Should retrieve teacher by ID when authenticated")
    @WithMockUser(username = USER_TEST_EMAIL)
    void shouldRetrieveTeacherByIdWhenAuthenticated() throws Exception {
        mockMvc.perform(get("/api/teacher/" + teacher1.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(teacher1.getId()))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"));
    }

    @Test
    @DisplayName("Should return 404 when teacher ID does not exist")
    @WithMockUser(username = USER_TEST_EMAIL)
    void shouldReturn404WhenTeacherNotFound() throws Exception {
        mockMvc.perform(get("/api/teacher/9999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should return 400 for invalid teacher ID format")
    @WithMockUser(username = USER_TEST_EMAIL)
    void shouldReturn400ForInvalidTeacherIdFormat() throws Exception {
        mockMvc.perform(get("/api/teacher/invalid-id"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return 401 when accessing teacher without authentication")
    void shouldReturn401WhenAccessingTeacherWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/teacher/" + teacher1.getId()))
                .andExpect(status().isUnauthorized());
    }

    /* FindAllTest */

    @Test
    @DisplayName("Should retrieve all teachers when authenticated")
    @WithMockUser(username = USER_TEST_EMAIL)
    void shouldRetrieveAllTeachersWhenAuthenticated() throws Exception {
        Teacher teacher2 = createTeacher("Jane", "Smith");

        mockMvc.perform(get("/api/teacher"))
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
    @WithMockUser(username = USER_TEST_EMAIL)
    void shouldReturnEmptyArrayWhenNoTeachersExist() throws Exception {
        cleanDatabase();

        mockMvc.perform(get("/api/teacher"))
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
