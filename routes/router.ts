
import { Router, Request, Response} from 'express';
import Server from '../classes/server';
import { Socket } from 'socket.io';
import { usuariosConectados } from '../sockets/socket';
import { GraficaData } from '../classes/grafica';

export const router = Router();

const grafica = new GraficaData();

router.get('/grafica', ( req: Request, res: Response) =>{

    res.json( grafica.getDataGrafica() );


});

router.post('/grafica', ( req: Request, res: Response) =>{

    const mes      = req.body.mes;
    const unidades = Number(req.body.unidades);

    grafica.incrementarValor( mes, unidades);

    const server = Server.instance;
    server.io.emit('cambio-grafica', grafica.getDataGrafica() );

    res.json( grafica.getDataGrafica() );


});

router.get('/graficabarra', ( req: Request, res: Response) =>{

    res.json( grafica.getDataGraficaBarra() );


});

router.post('/graficabarra', ( req: Request, res: Response) =>{

    const opcion   = Number(req.body.opcion);
    const unidades = Number(req.body.unidades);

    grafica.incrementarValorBarra( opcion, unidades);

    const server = Server.instance;
    server.io.emit('cambio-graficabarra', grafica.getDataGraficaBarra() );

    res.json( grafica.getDataGraficaBarra() );


});

router.post('/mensajes/:id', ( req: Request, res: Response) =>{

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;
    const id     = req.params.id;

    const payload = {
        de,
        cuerpo
    }

    const server = Server.instance;

    // Mensaje Privado
    server.io.in( id ).emit( 'mensaje-privado', payload );

    // Mensaje Publico
    server.io.emit( 'mensaje-nuevo', payload );


    res.json({
        ok:true,
        cuerpo,
        de,
        id
    })


});

// Servicio para obtener todos los IDS de los usuarios

router.get('/usuarios',( req: Request, res: Response) => {

    const server = Server.instance;

    server.io.clients( ( err: any, clientes: string[]) =>{

        if( err ){
            res.json({
                ok: false,
                err
            })

        }

        res.json({
            ok: true,
            clientes
        });

        
    });

});

// Obtener usuarios y sus nombres

router.get('/usuarios/detalle',( req: Request, res: Response) => {

    res.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    });

});

export  default router;

