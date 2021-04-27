import React from "react";
import "./styles.styl";
const Developer = React.forwardRef((datos, ref) => {
  return (
    <div className='developer'>
      <span className='developer--note'>
        <small>Haz click para copiar al portapapeles</small>
      </span>
      <pre ref={ref} style={{ width: 400, whiteSpace: "normal" }}>
        {JSON.stringify(datos.data, null, 2)}
      </pre>
    </div>
  );
});

export default Developer;
