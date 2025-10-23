package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.TestUtils;
import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest extends TestUtils {

    @InjectMocks
    private SessionService sessionService;

    @Mock
    private SessionRepository sessionRepository;
    @Mock
    private UserRepository userRepository;

    private static final Long SESSION_ID = 1L;

    @Test
    void createTest() {
        Session expectedSession = getSession();

        when(sessionRepository.save(any(Session.class))).thenReturn(expectedSession);

        Session result = sessionService.create(expectedSession);

        assertNotNull(result);
        assertEquals(expectedSession, result);
        verify(sessionRepository, times(1)).save(any(Session.class));
    }

    @Test
    void deleteTest() {
        assertThatNoException().isThrownBy(() -> sessionService.delete(SESSION_ID));
    }

    @Test
    void findAllTest() {
        List<Session> expectedSessions = getSessionList();

        when(sessionRepository.findAll()).thenReturn(expectedSessions);

        List<Session> result = sessionService.findAll();

        assertNotNull(result);
        assertEquals(expectedSessions.size(), result.size());
        assertEquals(expectedSessions, result);
        verify(sessionRepository, times(1)).findAll();
    }

    @Nested
    @DisplayName("getByIdTest")
    class getByIdTest {
        @Test
        void shouldReturnSession() {
            Session expectedSession = getSession();

            when(sessionRepository.findById(anyLong())).thenReturn(java.util.Optional.of(expectedSession));

            Session result = sessionService.getById(SESSION_ID);

            assertNotNull(result);
            assertEquals(expectedSession, result);
            verify(sessionRepository, times(1)).findById(SESSION_ID);
        }

        @Test
        void whenSessionNotFound_thenReturnNull() {
            when(sessionRepository.findById(anyLong())).thenReturn(java.util.Optional.empty());

            assertNull(sessionService.getById(SESSION_ID));
            verify(sessionRepository, times(1)).findById(SESSION_ID);
        }
    }

    @Test
    void updateTest() {
        Long updateId = 2L;
        Session expectedSession = getSession();
        expectedSession.setId(updateId);

        when(sessionRepository.save(any(Session.class))).thenReturn(expectedSession);

        Session result = sessionService.update(updateId, expectedSession);

        assertNotNull(result);
        assertEquals(expectedSession, result);
        verify(sessionRepository, times(1)).save(expectedSession);
    }

    @Nested
    @DisplayName("participateTest")
    class participateTest {
        private User user;

        @BeforeEach
        void setUp() {
            user = getUser();
            user.setId(2L);
        }

        @Test
        void shouldAddUserToSession() {
            Session session = getSession();

            when(sessionRepository.findById(anyLong())).thenReturn(Optional.of(session));
            when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));

            assertFalse(session.getUsers().contains(user));
            assertThatNoException().isThrownBy(
                    () -> sessionService.participate(SESSION_ID, user.getId())
            );
            assertTrue(session.getUsers().contains(user));
            verify(sessionRepository, times(1)).findById(SESSION_ID);
            verify(userRepository, times(1)).findById(user.getId());
        }

        @Test
        void whenSessionNotFound_thenReturnHttp404() {
            when(sessionRepository.findById(anyLong())).thenReturn(Optional.empty());
            when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));

            assertThatExceptionOfType(NotFoundException.class).isThrownBy(
                    () -> sessionService.participate(SESSION_ID, user.getId())
            );
            verify(sessionRepository, times(1)).findById(SESSION_ID);
            verify(userRepository, times(1)).findById(user.getId());
        }

        @Test
        void whenUserNotFound_thenReturnHttp404() {
            when(sessionRepository.findById(anyLong())).thenReturn(Optional.of(getSession()));
            when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

            assertThatExceptionOfType(NotFoundException.class).isThrownBy(
                    () -> sessionService.participate(SESSION_ID, user.getId())
            );
            verify(sessionRepository, times(1)).findById(SESSION_ID);
            verify(userRepository, times(1)).findById(user.getId());
        }

        @Test
        void whenUserAlreadyInSession_thenReturnHttp400() {
            User userAlreadyInSession = getUser();

            when(sessionRepository.findById(anyLong())).thenReturn(Optional.of(getSession()));
            when(userRepository.findById(anyLong())).thenReturn(Optional.of(userAlreadyInSession));

            assertThatExceptionOfType(BadRequestException.class).isThrownBy(
                    () -> sessionService.participate(SESSION_ID, userAlreadyInSession.getId())
            );
            verify(sessionRepository, times(1)).findById(SESSION_ID);
            verify(userRepository, times(1)).findById(userAlreadyInSession.getId());
        }
    }

    @Nested
    @DisplayName("noLongerParticipateTest")
    class noLongerParticipateTest {
        private User user;

        @BeforeEach
        void setUp() {
            user = getUser();
        }

        @Test
        void shouldRemoveUserFromSession() {
            Session  session = getSession();

            when(sessionRepository.findById(anyLong())).thenReturn(Optional.of(session));

            assertTrue(session.getUsers().contains(user));
            assertThatNoException().isThrownBy(
                    () -> sessionService.noLongerParticipate(SESSION_ID, user.getId())
            );
            assertFalse(session.getUsers().contains(user));
            verify(sessionRepository, times(1)).findById(SESSION_ID);
        }

        @Test
        void whenSessionNotFound_thenReturnHttp404() {
            when(sessionRepository.findById(anyLong())).thenReturn(Optional.empty());

            assertThatExceptionOfType(NotFoundException.class).isThrownBy(
                    () -> sessionService.noLongerParticipate(SESSION_ID, user.getId())
            );
            verify(sessionRepository, times(1)).findById(SESSION_ID);
        }

        @Test
        void whenUserNotInSession_thenReturnHttp400() {
            long userIdNotInSession = 2L;

            when(sessionRepository.findById(anyLong())).thenReturn(Optional.of(getSession()));

            assertThatExceptionOfType(BadRequestException.class).isThrownBy(
                    () -> sessionService.noLongerParticipate(SESSION_ID, userIdNotInSession)
            );
            verify(sessionRepository, times(1)).findById(SESSION_ID);
        }
    }
}