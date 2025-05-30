package com.employee.reopisitorytest;

import com.employee.entity.AssistRequestDao;
import com.employee.repository.AssistRequestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AssistRequestRepositoryTest {

    @Mock
    private AssistRequestRepository assistRequestRepository;

    private AssistRequestDao request1;
    private AssistRequestDao request2;

    @BeforeEach
    void setUp() {
        request1 = new AssistRequestDao();
        request1.setId(1L);
        request1.setType("Type1");
        request1.setJustification("Justification1");
        request1.setNeededByDate(LocalDate.now().plusDays(5));

        request2 = new AssistRequestDao();
        request2.setId(2L);
        request2.setType("Type2");
        request2.setJustification("Justification2");
        request2.setNeededByDate(LocalDate.now().plusDays(10));
    }


    @Test
    public void testFindAll() {
        when(assistRequestRepository.findAll()).thenReturn(Arrays.asList(request1, request2));

        List<AssistRequestDao> requests = assistRequestRepository.findAll();

        assertNotNull(requests);
        assertEquals(2, requests.size());
        verify(assistRequestRepository, times(1)).findAll();
    }

    @Test
    public void testFindById_Found() {
        when(assistRequestRepository.findById(1L)).thenReturn(Optional.of(request1));

        Optional<AssistRequestDao> foundRequest = assistRequestRepository.findById(1L);

        assertTrue(foundRequest.isPresent());
        assertEquals("Type1", foundRequest.get().getType());
        verify(assistRequestRepository, times(1)).findById(1L);
    }

    @Test
    public void testFindById_NotFound() {
        when(assistRequestRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<AssistRequestDao> foundRequest = assistRequestRepository.findById(99L);

        assertFalse(foundRequest.isPresent());
        verify(assistRequestRepository, times(1)).findById(99L);
    }

    @Test
    public void testSave() {
        when(assistRequestRepository.save(request1)).thenReturn(request1);

        AssistRequestDao savedRequest = assistRequestRepository.save(request1);

        assertNotNull(savedRequest);
        assertEquals("Type1", savedRequest.getType());
        verify(assistRequestRepository, times(1)).save(request1);
    }

    @Test
    public void testDelete() {
        doNothing().when(assistRequestRepository).delete(request1);

        assistRequestRepository.delete(request1);

        verify(assistRequestRepository, times(1)).delete(request1);
    }
}
