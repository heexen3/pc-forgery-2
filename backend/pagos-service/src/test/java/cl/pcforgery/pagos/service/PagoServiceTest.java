package cl.pcforgery.pagos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import cl.pcforgery.pagos.dto.PagoRequest;
import cl.pcforgery.pagos.model.EstadoPago;
import cl.pcforgery.pagos.model.Pago;
import cl.pcforgery.pagos.repository.PagoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PagoServiceTest {

    @Mock
    private PagoRepository pagos;

    @InjectMocks
    private PagoService pagoService;

    @BeforeEach
    void preparar() {
        when(pagos.save(any(Pago.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    void pagoNormalSeApruebaConCodigoDeTransaccion() {
        Pago pago = pagoService.procesar(new PagoRequest(1L, 259980, "Débito", "", "juan@gmail.com", false));

        assertThat(pago.getEstado()).isEqualTo(EstadoPago.APROBADO);
        assertThat(pago.getMotivo()).isNull();
        assertThat(pago.getCodigoTransaccion()).startsWith("TX-");
    }

    @Test
    void simularPagoNoExitosoSeRechazaConMotivo() {
        Pago pago = pagoService.procesar(new PagoRequest(2L, 259980, "Crédito", "", "juan@gmail.com", true));

        assertThat(pago.getEstado()).isEqualTo(EstadoPago.RECHAZADO);
        assertThat(pago.getMotivo()).isEqualTo(PagoService.MOTIVO_SIMULADO);
    }
}
