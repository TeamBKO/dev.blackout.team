const buildComponentRows = (arr, style) => {
  const rowSize = 5;
  const rows = [];

  const buildButtons = (arr, start) => {
    const buttons = [];
    for (let col = start; col < arr.length && col < start + rowSize; col++) {
      const form = arr[col].roster_form;
      const url = arr[col].url;
      const customId = arr[col].id;
      const button = {
        type: 2,
        style: form ? 5 : 2,
        label: arr[col].name,
        disbaled: arr[col].disabled ? arr[col].disabled : false,
      };

      if (form && url) {
        Object.assign(button, { url });
      } else {
        Object.assign(button, {
          custom_id: `roster:join:${customId}`,
        });
      }

      buttons.push(button);
    }
    return buttons;
  };

  for (let row = 0; row < arr.length / rowSize; row++) {
    const start = row * rowSize;
    const newRow = [
      {
        type: 1,
        components: [...buildButtons(arr, start)],
      },
    ];
    rows.push(newRow);
  }

  return rows;
};

export default buildComponentRows;
