package com.openclassrooms.starterjwt;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class TestUtils {

    /* **************************************** SESSION **************************************** */
    public Session getSession() {
        return Session.builder()
                .id(1L)
                .name("name")
                .date(new Date())
                .description("description")
                .teacher(getTeacher())
                .users(new ArrayList<>(List.of(getUser())))
                .createdAt(LocalDateTime.now().minusDays(1))
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public SessionDto getSessionDto(Session session) {
        return SessionDto.builder()
                .id(session.getId())
                .name(session.getName())
                .date(session.getDate())
                .teacher_id(session.getTeacher().getId())
                .description(session.getDescription())
                .build();
    }

    public List<Session> getSessionList() {
        return List.of(getSession(), getSession());
    }

    public List<SessionDto> getSessionDtoList(List<Session> sessions) {
        List<SessionDto> sessionDtoList = new ArrayList<>();
        for (Session session : sessions) {
            sessionDtoList.add(getSessionDto(session));
        }
        return sessionDtoList;
    }

    /* **************************************** TEACHER **************************************** */
    public Teacher getTeacher() {
        return Teacher.builder()
                .id(1L)
                .lastName("lastname")
                .firstName("firstname")
                .createdAt(LocalDateTime.now().minusDays(1))
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public TeacherDto getTeacherDto(Teacher teacher) {
        return TeacherDto.builder()
                .id(teacher.getId())
                .lastName(teacher.getLastName())
                .firstName(teacher.getFirstName())
                .createdAt(teacher.getCreatedAt())
                .updatedAt(teacher.getUpdatedAt())
                .build();
    }

    public List<Teacher> getTeacherList() {
        return List.of(getTeacher(), getTeacher());
    }

    public List<TeacherDto> getTeacherDtoList(List<Teacher> teachers) {
        List<TeacherDto> teacherDtoList = new ArrayList<>();
        for (Teacher teacher : teachers) {
            teacherDtoList.add(getTeacherDto(teacher));
        }
        return teacherDtoList;
    }

    /* **************************************** USER **************************************** */
    public User getUser() {
        return User.builder()
                .id(1L)
                .email("test-user@email.com")
                .lastName("lastname")
                .firstName("firstname")
                .password("password")
                .admin(false)
                .createdAt(LocalDateTime.now().minusDays(1))
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public UserDto getUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .lastName(user.getLastName())
                .firstName(user.getFirstName())
                .admin(user.isAdmin())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    /* **************************************** USER DETAILS **************************************** */
    public UserDetailsImpl getUserDetailsImpl(User user) {
        return UserDetailsImpl.builder()
                .id(user.getId())
                .username(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .password(user.getPassword())
                .build();
    }

    /* **************************************** JWT TOKEN **************************************** */
    public String getToken(String username, String secret, int expiration) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + expiration))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    /* **************************************** REQUEST **************************************** */
    public LoginRequest getLoginRequest(String email) {
        return LoginRequest.builder()
                .email(email)
                .password("password")
                .build();
    }

    public SignupRequest getSignupRequest(User user) {
        return SignupRequest.builder()
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .password(user.getPassword())
                .build();
    }

}
