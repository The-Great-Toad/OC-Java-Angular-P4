package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.TestUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtUtilsTest extends TestUtils {

    @InjectMocks
    private JwtUtils jwtUtils;

    private static final String JWT_SECRET = "secret";
    private static final int JWT_EXPIRATION_MS = 3600;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", JWT_SECRET);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", JWT_EXPIRATION_MS);
    }

    @Test
    void verifyFieldsAreSet() {
        String secret = (String) ReflectionTestUtils.getField(jwtUtils, "jwtSecret");
        Integer expiration = (Integer) ReflectionTestUtils.getField(jwtUtils, "jwtExpirationMs");

        assertEquals(JWT_SECRET, secret);
        assertEquals(JWT_EXPIRATION_MS, expiration);
    }

    @Test
    void generateJwtTokenTest() {
        UserDetailsImpl principal = mock(UserDetailsImpl.class);
        Authentication authentication = mock(Authentication.class);

        when(authentication.getPrincipal()).thenReturn(principal);

        String token = jwtUtils.generateJwtToken(authentication);

        assertNotNull(token);
    }

    @Test
    void getUserNameFromJwtTokenTest() {
        String username = "username";
        String token = getToken(username, JWT_SECRET, JWT_EXPIRATION_MS);

        String result = jwtUtils.getUserNameFromJwtToken(token);

        assertNotNull(result);
        assertEquals(username, result);
    }

    @Test
    void validateJwtTokenTest() {
        String token = getToken("username", JWT_SECRET, JWT_EXPIRATION_MS);
        boolean result = jwtUtils.validateJwtToken(token);

        assertTrue(result);
    }

    @Nested
    @DisplayName("validateJwtTokenExceptionTest")
    class validateJwtTokenExceptionTest {
        @Test
        void SignatureException() {
            String token = getToken("username", "invalid-secret", JWT_EXPIRATION_MS);

            assertFalse(jwtUtils.validateJwtToken(token));
        }

        @Test
        void MalformedJwtException() {
            String malformedToken = "malformed.jwt.token";

            assertFalse(jwtUtils.validateJwtToken(malformedToken));
        }

        @Test
        void ExpiredJwtException() {
            String token = getToken("username", JWT_SECRET, 1);

            assertFalse(jwtUtils.validateJwtToken(token));
        }

        @Test
        void UnsupportedJwtException() {
            String unsupportedToken = Jwts.builder().setSubject("username").compact();

            assertFalse(jwtUtils.validateJwtToken(unsupportedToken));
        }

        @Test
        void IllegalArgumentException() {
            assertFalse(jwtUtils.validateJwtToken(null));
        }
    }
}