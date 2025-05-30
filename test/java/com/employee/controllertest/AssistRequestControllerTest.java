package com.employee.controllertest;

import com.employee.controller.AssistRequestController;
import com.employee.dto.AssistRequestDto;
import com.employee.service.AssistRequestService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.*;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

class AssistRequestControllerTest {


	@Mock
	private AssistRequestService assistRequestService;

	@InjectMocks
	private AssistRequestController assistRequestController;

	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

	@BeforeEach
	void setUp() {

		MockitoAnnotations.openMocks(this);
		mockMvc = MockMvcBuilders.standaloneSetup(assistRequestController).build();
	} @BeforeEach
    public void setup() {
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

	@Test
	void createAssistRequest() throws Exception {
	    AssistRequestDto dto = new AssistRequestDto();
	    dto.setType("IT Support");
	    dto.setJustification("Need help with setup");
	    dto.setNeededByDate(LocalDate.of(2025, 6, 1));

	    mockMvc.perform(post("/api/assist-requests")
	            .contentType(MediaType.APPLICATION_JSON)
	            .content(objectMapper.writeValueAsString(dto)))
	            .andExpect(status().isCreated());
	}

	@Test
	void getAllAssistRequests() throws Exception {
		List<AssistRequestDto> list = new ArrayList<>();
		AssistRequestDto dto = new AssistRequestDto();
		dto.setType("Type1");
		list.add(dto);

		when(assistRequestService.getAllAssistRequests()).thenReturn(list);

		mockMvc.perform(get("/api/assist-requests")).andExpect(status().isOk())
				.andExpect(jsonPath("$[0].type").value("Type1"));

		verify(assistRequestService, times(1)).getAllAssistRequests();
	}

	@Test
	void getAssistRequestById() throws Exception {
		// Test when found
		AssistRequestDto dto = new AssistRequestDto();
		dto.setType("Type1");

		when(assistRequestService.getAssistRequestById(1L)).thenReturn(dto);

		mockMvc.perform(get("/api/assist-requests/1")).andExpect(status().isOk())
				.andExpect(jsonPath("$.type").value("Type1"));

		// Test when not found
		when(assistRequestService.getAssistRequestById(2L)).thenReturn(null);

		mockMvc.perform(get("/api/assist-requests/2")).andExpect(status().isNotFound());

		verify(assistRequestService, times(1)).getAssistRequestById(1L);
		verify(assistRequestService, times(1)).getAssistRequestById(2L);
	}

	@Test
	void updateAssistRequest() throws Exception {
	    Long id = 1L;
	    AssistRequestDto dto = new AssistRequestDto();
	    dto.setType("TypeUpdated");
	    dto.setJustification("JustificationUpdated");
	    dto.setNeededByDate(LocalDate.now().plusDays(1));  // valid future or present date if validation exists

	    when(assistRequestService.updateAssistRequest(eq(id), any(AssistRequestDto.class))).thenReturn(dto);

	    mockMvc.perform(put("/api/assist-requests/{id}", id)
	            .contentType(MediaType.APPLICATION_JSON)
	            .content(objectMapper.writeValueAsString(dto)))
	            .andDo(print())  // To debug the actual response
	            .andExpect(status().isOk())
	            .andExpect(jsonPath("$.type").value("TypeUpdated"))
	            .andExpect(jsonPath("$.justification").value("JustificationUpdated"));

	    verify(assistRequestService, times(1)).updateAssistRequest(eq(id), any(AssistRequestDto.class));
	}


	@Test
	void deleteAssistRequest() throws Exception {
		// Found (deleted)
		when(assistRequestService.deleteAssistRequest(1L)).thenReturn(true);

		mockMvc.perform(delete("/api/assist-requests/1")).andExpect(status().isNoContent());

		// Not found (not deleted)
		when(assistRequestService.deleteAssistRequest(2L)).thenReturn(false);

		mockMvc.perform(delete("/api/assist-requests/2")).andExpect(status().isNotFound());

		verify(assistRequestService, times(1)).deleteAssistRequest(1L);
		verify(assistRequestService, times(1)).deleteAssistRequest(2L);
	}
}
