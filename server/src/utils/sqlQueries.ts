const getOrderWithTableNumber = (tableNumber: number) => {
  return `SELECT TOP 1
    op.Orden AS bill,
    op.Mesa as tableNumber,
    op.Personas,
    op.HoraAbrir,
    (op.Total * 100) as total,  -- Multiplicamos por 100
    op.Impresa,
    op.status,
    -- Construcción manual de JSON para los platillos
    (
      SELECT 
        '[' + STUFF((
          SELECT 
            ',{"id":' + CAST(c.Id_Platillo AS NVARCHAR(10)) +
            ',"createdAt":"' + CONVERT(VARCHAR(8), c.Hora, 108) +
            '","name":"' + c.Descripcion +
            '","quantity":' + CAST(c.Cantidad AS NVARCHAR(10)) +
            ',"punitario":' + CAST(c.Punitario  * 100 AS NVARCHAR(20)) +
            ',"iva":' + CAST(c.IVACobrado * 100 AS NVARCHAR(20)) + -- Asumiendo un 16% de IVA
            ',"price":' + CAST((c.SubTotal * c.Cantidad * 100) AS NVARCHAR(20)) + '}' -- Total como Decimal
          FROM 
            NetSilver.dbo.Comanda AS c
          WHERE 
            c.Orden = op.Orden -- Solo platillos de la orden específica
            AND c.Modificador = 0 -- Solo platillos sin modificadores
            AND CONVERT(DATE, c.Hora) = CONVERT(DATE, GETDATE()) -- Solo platillos de hoy
          FOR XML PATH(''), TYPE
        ).value('.', 'NVARCHAR(MAX)'), 1, 1, '') + ']'
    ) AS products
  FROM 
    NetSilver.dbo.OrdenPendiente AS op
  INNER JOIN 
    NetSilver.dbo.Comanda AS c ON c.Orden = op.Orden
  WHERE 
    op.Mesa = ${tableNumber} -- Número de mesa deseado
    AND CONVERT(DATE, op.HoraAbrir) = CONVERT(DATE, GETDATE()) -- Filtra por la fecha de hoy
    AND c.Modificador = 0
  ORDER BY 
    op.HoraAbrir DESC`
}

export { getOrderWithTableNumber }
