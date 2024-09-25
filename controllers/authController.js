const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//-------*************************************------------
const login = async (req, res) => {
  const datos = req.body;
  console.log("datos+++",datos);
  try {
      const result = await pool.query('SELECT * FROM public.usuarios WHERE num_identificacion = $1', [datos.cedula]);

      if (result.rows.length > 0) {
          const user = result.rows[0];
          if (user.clave == datos.clave) {
              const token = jwt.sign({ id: user.id }, 'secreto_para_jwt', { expiresIn: '1h' });
              return res.status(200).json({ msg: 'Contraseña correcta', token });
          } else {
              return res.status(200).json(2);
          }
      } else {
          return res.status(200).json(1);
      }
  } catch (error) {
      return res.status(500).json({ msg: 'Error en el servidor' });
  }
};

//-------Consuta los datos de la persona logueada------------
const personas = async (req, res) => {
  const info = req.body;
  try {
    const datos = await pool.query('SELECT * FROM public.usuarios WHERE num_identificacion = $1', [info.cedula]);
    if (datos.rows.length > 0) {
      let info2 = datos.rows[0];
      return res.status(200).json({info2});
    }else {
      return res.status(200).json(1);
    }

  } catch (error) {
    return res.status(500).json({msg: 'Error en la consulta' });
  }
}

//-------*************************************------------
const oficios = async (req, res) => {
  console.log("LLEGA OFICIOS");
  try {
    const datos = await pool.query("SELECT * FROM public.oficios WHERE estado = 'A'");
    if (datos.rows.length > 0) {
      let oficios = datos.rows;
      return res.status(200).json({oficios});
    }else {
      return res.status(200).json({msg: 'Error en la consulta'});
    }

  } catch (error) {
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
}
//-------*************************************------------
const documentos = async (req, res) => {
  console.log("LLEGA DOCUMENTOS");
  try {
    const datos = await pool.query("SELECT * FROM public.tipo_documento WHERE estado = 'A'");
    if (datos.rows.length > 0) {
      let documentos = datos.rows;
      return res.status(200).json({documentos});
    }else {
      return res.status(200).json({msg: 'Error en la consulta'});
    }

  } catch (error) {
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
}
//-------*************************************------------
const agregar = async (req, res) => {
  console.log("LLEGA AGREGAR", req.body);
  const form = req.body.formulario;
  const form2 = req.body.formulario2;

  try {
    
    const query1 = `INSERT INTO public.usuarios (num_identificacion, nombres, apellidos, celular, correo, direccion, rol, clave, id_tipo_documento) 
      VALUES ('${form.num_identificacion}', '${form.nombres}', '${form.apellidos}', '${form.celular}', '${form.correo}', '${form.direccion}', '${form.rol}', '${form.clave}', '${form.id_tipo_documento}')`;
    const datos = await pool.query(query1);

    if (form.rol === 'T' || form.rol === 'D') {
      const query2 = `SELECT * FROM public.usuarios WHERE num_identificacion = '${form.num_identificacion}'`;
      const datos2 = await pool.query(query2);
      
      const info2 = datos2.rows[0];
      console.log("info2", info2);

      form2.id_usuario = info2.id_usuario;
      form2.id_oficio = Number(form2.id_oficio);
      console.log("formulario2", form2);

      const query3 = `INSERT INTO public.usuario_oficio (id_usuario, detalle, precio_servicio, id_oficio) 
        VALUES ('${form2.id_usuario}', '${form2.detalle}', '${form2.precio_servicio}', ${form2.id_oficio})`;
      const datos3 = await pool.query(query3);
      return res.status(200).json({ info3: datos3 });
    }

    return res.status(200).json(datos);
  } catch (error) {
    console.log("error-------------", error);
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
};

//-------*************************************------------
const servicioUsuario = async (req, res) => {
  console.log("LLEGA SERVICIOS");
  try {
    const datos = await pool.query("SELECT u.id_usuario, uo.detalle, uo.precio_servicio, u.nombres , u.apellidos, uo.id_usuario_oficio, u.celular, u.correo, o.detalle as oficio FROM public.usuario_oficio uo join public.usuarios u on u.id_usuario = uo.id_usuario  join public.oficios o on o.id_oficio = uo.id_oficio WHERE uo.estado = 'A' order by u.nombres");
    if (datos.rows.length > 0) {
      let serviciosusu = datos.rows;
      return res.status(200).json({serviciosusu});
    }else {
      return res.status(200).json({msg: 'Error en la consulta'});
    }

  } catch (error) {
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
}

//-------*************************************------------
const servicio = async (req, res) => {
  console.log("LLEGA AGREGAR SERVICIO", req.body);
  const form = req.body.formulario;
  try {
    const query1 = `INSERT INTO public.servicios (id_usuario, id_usuario_oficio, valor_servicio) 
      VALUES ('${form.id_usuario}', '${form.id_usuario_oficio}', '${form.valor_servicio}')`;
    const datos = await pool.query(query1);

    return res.status(200).json(datos);
  } catch (error) {
    console.log("error-------------", error);
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
};

//-------*************************************------------
const agregaroficio = async (req, res) => {
  console.log("LLEGA AGREGAR agregaroficio", req.body);
  const form = req.body.formulario;
  try {
    const query1 = `INSERT INTO public.oficios (detalle) 
      VALUES ('${form.oficio}')`;
    const datos = await pool.query(query1);

    return res.status(200).json(datos);
  } catch (error) {
    console.log("error-------------", error);
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
};

//-------*********************************------------
const servsoli = async (req, res) => {
  console.log("Buscar servSoli", req.body);
  
  const info = req.body;
  try {
    const datos = await pool.query(
      `select
      s.id_servicio ,
      s.valor_servicio ,
      s.estado ,
      u.nombres as responsable,
      uo.detalle
      from public.servicios s 
      join public.usuario_oficio uo on s.id_usuario_oficio = uo.id_usuario_oficio
      join public.usuarios u on uo.id_usuario = u.id_usuario
      where s.id_usuario = $1`, [info.id_usuario]);
    if (datos.rows.length > 0) {
      let info2 = datos.rows;
      return res.status(200).json({info2});
    }else {
      return res.status(200).json({msg: 'error en la solicitud'});
    }

  } catch (error) {
    return res.status(500).json({msg: 'Error en la consulta' });
  }
}

//-------*********************************------------
const soliserv = async (req, res) => {
  console.log("Buscar soliserv", req.body);
  
  const info = req.body;
  try {
    const datos = await pool.query(
    `select
    u.nombres ,
    u.apellidos ,
    u.celular ,
    u.correo ,
    u.direccion ,
    uo.detalle ,
    s.valor_servicio ,
    s.estado 
    from usuario_oficio uo 
    join public.servicios s on s.id_usuario_oficio = uo.id_usuario_oficio
    join usuarios u on s.id_usuario = u.id_usuario 
    where uo.id_usuario = $1`, [info.id_usuario]);
    if (datos.rows.length > 0) {
      let info2 = datos.rows;
      return res.status(200).json({info2});
    }else {
      return res.status(200).json({msg: 'error en la solicitud'});
    }

  } catch (error) {
    return res.status(500).json({msg: 'Error en la consulta' });
  }
}

//-------*********************************------------
const peradmin = async (req, res) => {
  console.log("LLEGA peradmin");
  try {
    const datos = await pool.query(`select 
    u.id_usuario ,
    u.num_identificacion,
    u.nombres  ,
    u.apellidos ,
    u.celular ,
    u.correo ,
    u.rol ,
    u.direccion 
    from public.usuarios u where u.rol = 'T' or u.rol = 'C' or u.rol = 'D'`);
    if (datos.rows.length > 0) {
      let info2 = datos.rows;
      return res.status(200).json({info2});
    }else {
      return res.status(200).json({msg: 'Error en la consulta'});
    }

  } catch (error) {
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
}


module.exports = { 
  login,
  personas,
  oficios,
  agregar,
  servicioUsuario,
  servicio,
  servsoli,
  soliserv,
  peradmin,
  documentos,
  agregaroficio
};
