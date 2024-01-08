const express = require('express');
const cors = require('cors');
const app = express();

const notificaciones = [
    { id: 1, cuerpo: "te han asignado una nueva actividad" },
    { id: 2, cuerpo: "te eliminaron de un proyecto" }
];

let responsesClientes = [];

app.use(cors());
app.use(express.json());

app.get('/notificacion-nueva', (req, res) => {
    responsesClientes.push(res);

    // [res1, res2, res3]
    req.on('close', () => {
        const index = responsesClientes.length; 
        responsesClientes = responsesClientes.slice(index, 1);
    });
})

function responderNotificacion(notificacion) {
    for (res of responsesClientes) {
        res.status(200).json({
            success: true,
            notificacion
        });
    }

    responsesClientes = [];
}

app.get('/notificaciones', (req, res) => {

    res.status(200).json({
        success: true,
        notificaciones
    });
});

app.post('/notificaciones', (req, res) => {
    const idNotificacion = notificaciones.length > 0 ? notificaciones[notificaciones.length - 1].id + 1 : 1;

    const notificacion = {
        id: idNotificacion,
        cuerpo: req.body.cuerpo
    };

    notificaciones.push(notificacion);
    responderNotificacion(notificacion);

    return res.status(201).json({
        success: true,
        message: "notificación guardada exitosamente"
    })
});

app.listen(3000, () => console.log("servidor corriendo en puerto 3000"))