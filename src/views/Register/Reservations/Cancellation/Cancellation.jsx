import { Divider } from "antd";
import style from "./Cancellation.module.css"

const Cancellation = () => {
    return (
        <div className={style.cancellation}>
            <div className={style.cancellationBox}>
                <h6>Paso a paso ▪ Huésped</h6>
                <h1>Consulta la política de cancelación de tu estadía</h1>
                <p>A lo mejor solo necesitas tranquilidad antes de reservar, o quizás necesites cancelar ya mismo. Aquí te explicamos cómo encontrar la política de cancelación para tu estadía:</p>

                <Divider />

                <h2>Antes de reservar</h2>
                <p>Puedes consultar la información relativa a la cancelación en la página del anuncio, así como durante el proceso de reservación, antes de que realices el pago.</p>
                <h3>Después de reservar</h3>
                <p>Las horas y fechas que mostramos para las políticas de cancelación se basan en la zona horaria local del alojamiento. Los plazos de cancelación para recibir reembolsos se calculan a partir de la hora del check-in del alojamiento en su zona horaria local o a las 3:00 p. m. si no hay una hora de check-in establecida.</p>
                <p>Dependiendo de la duración de tu estadía, el momento en el que cancelas y la política de cancelación aplicable a tu reservación, es posible que recibas un reembolso parcial si cancelas después de haber hecho el check-in.</p>
                <p>Recuerda que, cuando canceles, el monto reembolsado nunca será mayor que el monto que pagaste.</p>

                <h3>Causas extenuantes</h3>
                <p>¿Tuviste que cancelar tu reservación debido a una emergencia o un desastre natural? Es posible que tengas derecho a un reembolso por causas extenuantes. </p>

                <h3>Políticas de cancelación para anfitriones</h3>
                <p>Si eres anfitrión o quieres obtener más información sobre las políticas de cancelación disponibles, consulta las políticas de cancelación para tu anuncio.</p>

                <h3>Problemas durante el viaje</h3>
                <p>Si al llegar a tu alojamiento encuentras problemas que el anfitrión no puede resolver rápidamente, es posible que te proteja nuestra Política de reembolso y asistencia para cambio de reservación.</p>
            </div>
        </div>
    )
};

export default Cancellation;