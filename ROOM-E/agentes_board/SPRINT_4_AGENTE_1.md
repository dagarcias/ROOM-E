# SPRINT 4 - AGENTE 1
**Rol**: Data/Domain Layer para Shopping List -> Expense

## Misión
Tu objetivo es diseñar e implementar la capa de datos y el dominio lógico para la transición y el manejo de los ítems de "Lista de Compras" (Shopping List) hacia su conversión en "Gastos" (Expenses) compartidos dentro del hogar.

## Principios Arquitectónicos (Principal Engineer Guidelines)
- **SOLID & Clean Code**: Asegurar que las interfaces y modelos estén bien segregados.
- **Separation of Concerns**: Tu dominio es estrictamente la lógica de datos, estado y modelos. No toques componentes de UI.
- **High Cohesion, Low Coupling**: La lógica para crear un item de compra debe ser independiente de la lógica de crear un gasto, pero debe existir un adaptador o servicio para convertir uno en otro de forma segura.

## Tareas Específicas
1. **Modelos y Tipos**: Define las interfaces `ShoppingItem` y la vinculación con `Expense`. ¿Cómo un `ShoppingItem` completado se convierte en un `Expense`?
2. **Store/State Management**: Implementa o extiende el modelo actual (ej. Zustand) para manejar la lista de compras del hogar (`shoppingListStore.ts`). Deberás proveer funciones claras como `addItem`, `toggleItem`, `removeItem`, y `convertItemsToExpense`.
3. **Servicios de Persistencia**: Prepara las funciones que se comunican o se comunicarán en el futuro de forma asíncrona para guardar esta data.

## Límites
- NO modifiques ningún archivo dentro de `src/components` o `src/screens`. 
- NO intentes manejar integraciones en tiempo real (eso es tarea del Agente 3).
- Cualquier duda arquitectónica, deja notas en el código para que yo (Principal Engineer) las revise durante el Code Review de integración.

¡Inicia tu sprint revisando el estado del Store y los modelos de datos existentes!
