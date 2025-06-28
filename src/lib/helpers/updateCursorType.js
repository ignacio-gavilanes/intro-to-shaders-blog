const updateCursorType = (isDraggingModel, isHoveringModel) => {
  if (isDraggingModel) {
    document.body.style.cursor = 'grabbing';
  } else if (isHoveringModel) {
    document.body.style.cursor = 'grab';
  } else {
    document.body.style.cursor = 'auto';
  }
}

export default updateCursorType;
