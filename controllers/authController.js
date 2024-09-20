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

//-------*************************************------------
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
const agregar = async (req, res) => {
  console.log("LLEGA AGREGAR", req.body);
  const form = req.body.formulario;
  const form2 = req.body.formulario2;

  try {
    
    const query1 = `INSERT INTO public.usuarios (num_identificacion, nombres, apellidos, celular, correo, direccion, rol, clave) 
      VALUES ('${form.num_identificacion}', '${form.nombres}', '${form.apellidos}', '${form.celular}', '${form.correo}', '${form.direccion}', '${form.rol}', '${form.clave}')`;
    const datos = await pool.query(query1);

    
    if (form.rol === 'T') {
      
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
    const datos = await pool.query("SELECT uo.detalle, uo.precio_servicio, u.nombres , u.apellidos, u.celular, u.correo, o.detalle as oficio FROM public.usuario_oficio uo join public.usuarios u on u.id_usuario = uo.id_usuario  join public.oficios o on o.id_oficio = uo.id_oficio WHERE uo.estado = 'A' order by u.nombres");
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


module.exports = { 
  login,
  personas,
  oficios,
  agregar,
  servicioUsuario
};
