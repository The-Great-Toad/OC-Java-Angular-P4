package com.openclassrooms.starterjwt.integration;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import org.junit.jupiter.api.*;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for session management.
 * These tests validate the complete CRUD and participation in sessions.
 */
@DisplayName("Integration Tests - Sessions")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class SessionIT extends ITUtils {

	private com.openclassrooms.starterjwt.models.User testUser;
    private Session session;
	private SessionDto sessionDto;

	@BeforeEach
	void setUp() {
		createTeacher("IT Teacher", "Integration");
        testUser = createUser("testuser@yoga.com");
        session = createSession();
		sessionDto = getSessionDto();
	}

	@AfterEach
	void tearDown() {
		cleanDatabase();
	}

	@Test
	@Order(1)
	@DisplayName("Should retrieve all sessions")
	@WithMockUser(username = USER_TEST_EMAIL)
	void shouldGetAllSessions() throws Exception {
		mockMvc.perform(get("/api/session"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$[*].name").exists());
	}

	@Test
	@Order(2)
	@DisplayName("Should retrieve a session by ID")
	@WithMockUser(username = USER_TEST_EMAIL)
	void shouldGetSessionById() throws Exception {
		mockMvc.perform(get("/api/session/" + session.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(session.getId()))
				.andExpect(jsonPath("$.name").value(session.getName()))
				.andExpect(jsonPath("$.description").value(session.getDescription()));
	}

	@Test
	@Order(3)
	@DisplayName("Should return 404 for a non-existent session")
	@WithMockUser(username = USER_TEST_EMAIL)
	void shouldReturn404ForNonExistentSession() throws Exception {
		mockMvc.perform(get("/api/session/99999"))
				.andExpect(status().isNotFound());
	}

	@Test
	@Order(4)
	@DisplayName("Should return BadRequest for an invalid ID")
	@WithMockUser(username = USER_TEST_EMAIL)
	void shouldReturnBadRequestForInvalidId() throws Exception {
		mockMvc.perform(get("/api/session/invalid"))
				.andExpect(status().isBadRequest());
	}

	@Test
	@Order(5)
	@DisplayName("Should create a new session (admin)")
	@WithMockUser(username = ADMIN_TEST_EMAIL, roles = {ADMIN})
	void shouldCreateNewSessionAsAdmin() throws Exception {
		mockMvc.perform(post("/api/session")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(sessionDto)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Test Session"))
				.andExpect(jsonPath("$.description").value("Test session description"));

		assertThat(sessionRepository.findAll().stream()
				.anyMatch(s -> s.getName().equals("Test Session"))).isTrue();
	}

	@Test
	@Order(6)
	@DisplayName("Should update an existing session (admin)")
	@WithMockUser(username = ADMIN_TEST_EMAIL, roles = {ADMIN})
	void shouldUpdateSessionAsAdmin() throws Exception {
		sessionDto.setName("Updated Session");
		sessionDto.setDescription("Updated description");

		mockMvc.perform(put("/api/session/" + session.getId())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(sessionDto)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value(sessionDto.getName()))
				.andExpect(jsonPath("$.description").value(sessionDto.getDescription()));

		Session updatedSession = sessionRepository.findById(session.getId()).orElse(null);
		assertThat(updatedSession).isNotNull();
		assertThat(updatedSession.getName()).isEqualTo(sessionDto.getName());
	}

	@Test
	@Order(7)
	@DisplayName("Should delete an existing session (admin)")
	@WithMockUser(username = ADMIN_TEST_EMAIL, roles = {ADMIN})
	void shouldDeleteSessionAsAdmin() throws Exception {
		mockMvc.perform(delete("/api/session/" + session.getId()))
				.andExpect(status().isOk());

		assertThat(sessionRepository.findById(session.getId())).isEmpty();
	}

	@Test
	@Order(8)
	@DisplayName("Should allow a user to participate in a session")
	@WithMockUser(username = USER_TEST_EMAIL)
	void shouldAllowUserToParticipateInSession() throws Exception {
		mockMvc.perform(post("/api/session/" + session.getId() + "/participate/" + testUser.getId()))
				.andExpect(status().isOk());

		Session updatedSession = sessionRepository.findById(session.getId()).orElse(null);
		assertThat(updatedSession).isNotNull();
		assertThat(updatedSession.getUsers()).anyMatch(u -> u.getId().equals(testUser.getId()));
	}

	@Test
	@Order(9)
	@DisplayName("Should allow a user to cancel their participation")
	@WithMockUser(username = USER_TEST_EMAIL)
	void shouldAllowUserToCancelParticipation() throws Exception {
		// Add user to session
		mockMvc.perform(post("/api/session/" + session.getId() + "/participate/" + testUser.getId()))
				.andExpect(status().isOk());

		// Cancel participation
		mockMvc.perform(delete("/api/session/" + session.getId() + "/participate/" + testUser.getId()))
				.andExpect(status().isOk());

		Session updatedSession = sessionRepository.findById(session.getId()).orElse(null);
		assertThat(updatedSession).isNotNull();
		assertThat(updatedSession.getUsers()).noneMatch(u -> u.getId().equals(testUser.getId()));
	}

	@Test
	@Order(10)
	@DisplayName("Should fail to participate with an invalid user ID")
	@WithMockUser(username = USER_TEST_EMAIL)
	void shouldFailToParticipateWithInvalidUserId() throws Exception {
		mockMvc.perform(post("/api/session/" + session.getId() + "/participate/invalid"))
				.andExpect(status().isBadRequest());
	}

	@Test
	@Order(11)
	@DisplayName("Should fail to access without authentication")
	void shouldFailToAccessWithoutAuthentication() throws Exception {
		mockMvc.perform(get("/api/session"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	@Order(12)
	@DisplayName("Should return 404 when deleting a non-existent session")
	@WithMockUser(username = ADMIN_TEST_EMAIL, roles = {"ADMIN"})
	void shouldReturn404WhenDeletingNonExistentSession() throws Exception {
		mockMvc.perform(delete("/api/session/99999"))
				.andExpect(status().isNotFound());
	}

	@Test
	@Order(13)
	@DisplayName("Should return BadRequest when updating with invalid session ID")
	@WithMockUser(username = ADMIN_TEST_EMAIL, roles = {"ADMIN"})
	void shouldReturnBadRequestWhenUpdatingWithInvalidId() throws Exception {
		mockMvc.perform(put("/api/session/invalid")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(sessionDto)))
				.andExpect(status().isBadRequest());
	}

	@Test
	@Order(14)
	@DisplayName("Should fail to participate with an invalid session ID")
	@WithMockUser(username = USER_TEST_EMAIL)
	void shouldFailToParticipateWithInvalidSessionId() throws Exception {
		mockMvc.perform(post("/api/session/invalid/participate/" + testUser.getId()))
				.andExpect(status().isBadRequest());
	}

	@Test
	@Order(15)
	@DisplayName("Should fail to cancel participation with invalid IDs")
	@WithMockUser(username = USER_TEST_EMAIL)
	void shouldFailToCancelParticipationWithInvalidIds() throws Exception {
		mockMvc.perform(delete("/api/session/invalid/participate/invalid"))
				.andExpect(status().isBadRequest());
	}
}
