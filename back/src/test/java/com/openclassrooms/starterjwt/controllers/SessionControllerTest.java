package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.openclassrooms.starterjwt.TestUtils;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class SessionControllerTest extends TestUtils {

    @InjectMocks
    private SessionController sessionController;

    @Mock
    private SessionMapper sessionMapper;
    @Mock
    private SessionService sessionService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(sessionController).build();
    }

    @Nested
    @DisplayName("findByIdTest")
    class findByIdTest {
        @Test
        void shouldReturnHttp200WhenValidSessionId() throws Exception {
            String id = "1";
            Session session = getSession();
            SessionDto sessionDto = getSessionDto(session);

            when(sessionService.getById(anyLong())).thenReturn(session);
            when(sessionMapper.toDto(any(Session.class))).thenReturn(sessionDto);

            mockMvc.perform(get("/api/session/{id}", id))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(sessionDto.getId()))
                    .andExpect(jsonPath("$.name").value(sessionDto.getName()))
                    .andExpect(jsonPath("$.date").value(sessionDto.getDate().getTime()))
                    .andExpect(jsonPath("$.teacher_id").value(sessionDto.getTeacher_id()))
                    .andExpect(jsonPath("$.description").value(sessionDto.getDescription()));

            verify(sessionService).getById(1L);
            verify(sessionMapper).toDto(session);

        }

        @Test
        void shouldReturnHttp404WhenSessionNotFound() throws Exception {
            String id = "1";

            when(sessionService.getById(anyLong())).thenReturn(null);

            mockMvc.perform(get("/api/session/{id}", id))
                    .andDo(print())
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$").doesNotExist());

            verify(sessionService).getById(1L);
        }

        @Test
        void shouldReturnHttp400WhenInvalidPathVariableType() throws Exception {
            String id = "invalid_id";

            mockMvc.perform(get("/api/session/{id}", id))
                    .andDo(print())
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$").doesNotExist());
        }
    }


    @Test
    void findAllTest() throws Exception {
        List<Session> sessions = getSessionList();
        List<SessionDto> sessionDtos = getSessionDtoList(sessions);

        when(sessionService.findAll()).thenReturn(sessions);
        when(sessionMapper.toDto(anyList())).thenReturn(sessionDtos);

        mockMvc.perform(get("/api/session"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(sessionDtos.get(0).getId()))
                .andExpect(jsonPath("$[0].name").value(sessionDtos.get(0).getName()))
                .andExpect(jsonPath("$[0].date").value(sessionDtos.get(0).getDate().getTime()))
                .andExpect(jsonPath("$[0].teacher_id").value(sessionDtos.get(0).getTeacher_id()))
                .andExpect(jsonPath("$[0].description").value(sessionDtos.get(0).getDescription()));

        verify(sessionService, times(1)).findAll();
        verify(sessionMapper).toDto(sessions);
    }

    @Test
    void createTest() throws Exception {
        Session session = getSession();
        SessionDto sessionDto = getSessionDto(session);

        when(sessionService.create(any(Session.class))).thenReturn(session);
        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session);
        when(sessionMapper.toDto(any(Session.class))).thenReturn(sessionDto);

        mockMvc.perform(post("/api/session")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(sessionDto.getId()))
                .andExpect(jsonPath("$.name").value(sessionDto.getName()))
                .andExpect(jsonPath("$.date").value(sessionDto.getDate().getTime()))
                .andExpect(jsonPath("$.teacher_id").value(sessionDto.getTeacher_id()))
                .andExpect(jsonPath("$.description").value(sessionDto.getDescription()));

        verify(sessionService).create(session);
        verify(sessionMapper).toEntity(sessionDto);
        verify(sessionMapper).toDto(session);
    }

    @Nested
    @DisplayName("updateTest")
    class updateTest {
        @Test
        void shouldReturnHttp200OnValidUpdate() throws Exception {
            String id = "1";
            Session session = getSession();
            SessionDto sessionDto = getSessionDto(session);

            when(sessionService.update(anyLong(), any(Session.class))).thenReturn(session);
            when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session);
            when(sessionMapper.toDto(any(Session.class))).thenReturn(sessionDto);

            mockMvc.perform(put("/api/session/{id}", id)
                            .contentType("application/json")
                            .content(objectMapper.writeValueAsString(sessionDto)))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(sessionDto.getId()))
                    .andExpect(jsonPath("$.name").value(sessionDto.getName()))
                    .andExpect(jsonPath("$.date").value(sessionDto.getDate().getTime()))
                    .andExpect(jsonPath("$.teacher_id").value(sessionDto.getTeacher_id()))
                    .andExpect(jsonPath("$.description").value(sessionDto.getDescription()));

            verify(sessionService).update(1L, session);
            verify(sessionMapper).toEntity(sessionDto);
            verify(sessionMapper).toDto(session);
        }

        @Test
        void shouldReturnHttp400WhenInvalidPathVariableType() throws Exception {
            String id = "invalid_id";
            SessionDto sessionDto = getSessionDto(getSession());

            mockMvc.perform(put("/api/session/{id}", id)
                            .contentType("application/json")
                            .content(objectMapper.writeValueAsString(sessionDto)))
                    .andDo(print())
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$").doesNotExist());
        }
    }

    @Nested
    @DisplayName("deleteTest")
    class deleteTest {
        @Test
        void shouldReturnHttp200WhenValidSessionId() throws Exception {
            String id = "1";

            when(sessionService.getById(anyLong())).thenReturn(getSession());

            mockMvc.perform(delete("/api/session/{id}", id))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").doesNotExist());

            verify(sessionService).getById(1L);
            verify(sessionService).delete(1L);
        }

        @Test
        void shouldReturnHttp404WhenSessionNotFound() throws Exception {
            String id = "1";

            when(sessionService.getById(anyLong())).thenReturn(null);

            mockMvc.perform(delete("/api/session/{id}", id))
                    .andDo(print())
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$").doesNotExist());

            verify(sessionService).getById(1L);
        }

        @Test
        void shouldReturnHttp400WhenInvalidPathVariableType() throws Exception {
            String id = "invalid_id";

            mockMvc.perform(delete("/api/session/{id}", id))
                    .andDo(print())
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$").doesNotExist());
        }
    }

    @Nested
    @DisplayName("participateTest")
    class participateTest {
        @Test
        void shouldReturnHttp200WhenValidSessionId() throws Exception {
            String id = "1";
            String userId = "1";

            mockMvc.perform(post("/api/session/{id}/participate/{userId}", id, userId))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").doesNotExist());

            verify(sessionService).participate(anyLong(), anyLong());
        }

        @Test
        void shouldReturnHttp400WhenInvalidPathVariableType() throws Exception {
            String id = "invalid_id";
            String userId = "1";

            mockMvc.perform(post("/api/session/{id}/participate/{userId}", id, userId))
                    .andDo(print())
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$").doesNotExist());
        }
    }

    @Nested
    @DisplayName("noLongerParticipateTest")
    class noLongerParticipateTest {
        @Test
        void shouldReturnHttp200WhenValidSessionId() throws Exception {
            String id = "1";
            String userId = "1";

            mockMvc.perform(delete("/api/session/{id}/participate/{userId}", id, userId))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").doesNotExist());

            verify(sessionService).noLongerParticipate(anyLong(), anyLong());
        }

        @Test
        void shouldReturnHttp400WhenInvalidPathVariableType() throws Exception {
            String id = "invalid_id";
            String userId = "1";

            mockMvc.perform(delete("/api/session/{id}/participate/{userId}", id, userId))
                    .andDo(print())
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$").doesNotExist());
        }
    }
}