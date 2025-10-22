package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.TestUtils;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TeacherServiceTest extends TestUtils {

    @InjectMocks
    private TeacherService teacherService;

    @Mock
    private TeacherRepository teacherRepository;

    private static final Long TEACHER_ID = 1L;

    @Test
    void findAll() {
        List<Teacher> expectedTeachers = getTeacherList();

        when(teacherRepository.findAll()).thenReturn(expectedTeachers);

        List<Teacher> result = teacherService.findAll();

        assertNotNull(result);
        assertEquals(expectedTeachers.size(), result.size());
        assertEquals(expectedTeachers, result);
    }

    @Nested
    @DisplayName("findByIdTest")
    class findByIdTest {
        @Test
        void shouldReturnTeacher() {
            Teacher expectedTeacher = getTeacher();

            when(teacherRepository.findById(TEACHER_ID)).thenReturn(java.util.Optional.of(expectedTeacher));

            Teacher result = teacherService.findById(TEACHER_ID);

            assertNotNull(result);
            assertEquals(expectedTeacher, result);
        }

        @Test
        void whenTeacherNotFound_thenReturnNull() {
            when(teacherRepository.findById(TEACHER_ID)).thenReturn(java.util.Optional.empty());

            assertNull(teacherService.findById(TEACHER_ID));
        }
    }
}