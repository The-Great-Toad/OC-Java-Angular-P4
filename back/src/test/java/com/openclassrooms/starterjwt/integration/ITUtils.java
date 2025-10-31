package com.openclassrooms.starterjwt.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.Date;

@SpringBootTest
@AutoConfigureMockMvc
public class ITUtils {

    @Autowired
    protected MockMvc mockMvc;
    @Autowired
    protected ObjectMapper objectMapper;
    @Autowired
    protected UserRepository userRepository;
    @Autowired
    protected SessionRepository sessionRepository;
    @Autowired
    protected TeacherRepository teacherRepository;
    @Autowired
    protected PasswordEncoder passwordEncoder;

    protected static final String USER_IT_EMAIL = "integration.test@yoga.com";
    protected static final String USER_TEST_EMAIL = "test@test.com";
    protected static final String ADMIN_TEST_EMAIL = "admin@admin.com";
    protected static final String ADMIN = "ADMIN";
    protected static final String LOGIN_URL = "/api/auth/login";

    /* **************************************** HELPER METHODS **************************************** */
    protected void cleanDatabase() {
        sessionRepository.deleteAll();
        userRepository.deleteAll();
        teacherRepository.deleteAll();
    }

    /* **************************************** REQUEST **************************************** */
    protected SignupRequest getSignupRequest() {
        return SignupRequest.builder()
                .email(USER_IT_EMAIL)
                .firstName("Integration")
                .lastName("Test")
                .password("testPassword123!")
                .build();
    }

    protected LoginRequest getLoginRequest() {
        return LoginRequest.builder()
                .email(USER_IT_EMAIL)
                .password("testPassword123!")
                .build();
    }

    protected LoginRequest getAdminLoginRequest() {
        createAdminUser();
        return LoginRequest.builder()
                .email("admin@admin.com")
                .password("password")
                .build();
    }

    /* **************************************** TEACHER **************************************** */
     protected Teacher createTeacher(String firstName, String lastName) {
        Teacher teacher = Teacher.builder()
                .firstName(firstName)
                .lastName(lastName)
                .build();
        return teacherRepository.save(teacher);
    }

    /* **************************************** USER **************************************** */
    protected User createUser(String email) {
        User user = User.builder()
                .email(email != null ? email : USER_IT_EMAIL)
                .firstName("Test")
                .lastName("User")
                .password(passwordEncoder.encode("password123"))
                .admin(false)
                .build();
        return userRepository.save(user);
    }

    protected void createAdminUser() {
        User user = User.builder()
                .email("admin@admin.com")
                .firstName("Test")
                .lastName("User")
                .password(passwordEncoder.encode("password"))
                .admin(true)
                .build();
        userRepository.save(user);
    }

    /* **************************************** SESSION **************************************** */
    protected Session createSession() {
        Session session = Session.builder()
                .name("Test Session")
                .date(new Date())
                .description("Test session description")
                .teacher(createTeacher("Session", "Teacher"))
                .users(new ArrayList<>())
                .build();
        return sessionRepository.save(session);
    }

    protected SessionDto getSessionDto() {
        return SessionDto.builder()
                .name("Test Session")
                .date(new Date())
                .description("Test session description")
                .teacher_id(createTeacher("Session", "Teacher").getId())
                .users(new ArrayList<>())
                .build();
    }

    /* **************************************** JWT TOKEN **************************************** */
    protected String generateToken(String email) {
    return io.jsonwebtoken.Jwts.builder()
            .setSubject(email)
            .setIssuedAt(new java.util.Date())
            .setExpiration(new java.util.Date((new java.util.Date()).getTime() + 86400000)) // 24 hours
            .signWith(io.jsonwebtoken.SignatureAlgorithm.HS512, "openclassrooms")
            .compact();
    }
}
