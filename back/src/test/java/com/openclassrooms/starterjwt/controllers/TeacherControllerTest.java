package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.TestUtils;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
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
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class TeacherControllerTest extends TestUtils {

    @InjectMocks
    private TeacherController teacherController;

    @Mock
    private TeacherMapper teacherMapper;
    @Mock
    private TeacherService teacherService;

    private MockMvc mockMvc;

    private static final String FIND_BY_ID_URL = "/api/teacher/{id}";

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(teacherController).build();
    }

    @Nested
    @DisplayName("findByIdTest")
    class findByIdTest {
        @Test
        void shouldReturnHttp200WhenTeacherIdIsValid() throws Exception {
            String id = "1";
            Teacher teacher = getTeacher();
            TeacherDto teacherDto = getTeacherDto(teacher);


            when(teacherService.findById(anyLong())).thenReturn(teacher);
            when(teacherMapper.toDto(teacher)).thenReturn(teacherDto);

            mockMvc.perform(get(FIND_BY_ID_URL, id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(teacher.getId()))
                    .andExpect(jsonPath("$.firstName").value(teacherDto.getFirstName()))
                    .andExpect(jsonPath("$.lastName").value(teacherDto.getLastName()));

            verify(teacherService).findById(anyLong());
        }

        @Test
        void shouldReturnHttp404WhenTeacherIsNotFound() throws Exception {
            String id = "1";

            when(teacherService.findById(anyLong())).thenReturn(null);

            mockMvc.perform(get(FIND_BY_ID_URL, id))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$").doesNotExist());

            verify(teacherService, times(1)).findById(anyLong());
        }

        @Test
        void shouldReturnHttp400WhenInvalidPathVariableType() throws Exception {
            String id = "invalid_id";

            mockMvc.perform(get(FIND_BY_ID_URL, id))
                    .andDo(print())
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$").doesNotExist());
        }
    }

    @Test
    void findAllTest() throws Exception {
        List<Teacher> teachers = getTeacherList();
        List<TeacherDto> teacherDtos = getTeacherDtoList(teachers);

        when(teacherService.findAll()).thenReturn(teachers);
        when(teacherMapper.toDto(anyList())).thenReturn(teacherDtos);

        mockMvc.perform(get("/api/teacher"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(teacherDtos.get(0).getId()))
                .andExpect(jsonPath("$[0].lastName").value(teacherDtos.get(0).getLastName()))
                .andExpect(jsonPath("$[0].firstName").value(teacherDtos.get(0).getFirstName()));

        verify(teacherService, times(1)).findAll();
        verify(teacherMapper).toDto(teachers);
    }
}