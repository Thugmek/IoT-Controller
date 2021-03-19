let Calls = {
  async call(method, url, dtoIn) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: method, // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dtoIn),
    });
    return response.json();
  },

  getCommandUri(aUseCase) {
    return "http://192.168.1.142:3000/" + aUseCase;
  },

  loadMessages(dtoIn) {
    let uri = Calls.getCommandUri("notifier/list/");
    return Calls.call("GET", uri, dtoIn);
  },

  updateMessages(dtoIn) {
    let uri = Calls.getCommandUri("notifier/update/");
    return Calls.call("POST", uri, dtoIn);
  },
  deleteMessages(dtoIn) {
    let uri = Calls.getCommandUri("notifier/delete/");
    return Calls.call("POST", uri, dtoIn);
  },
  createMessages(dtoIn) {
    let uri = Calls.getCommandUri("notifier/create/");
    return Calls.call("POST", uri, dtoIn);
  },
  playMessages(dtoIn) {
    let uri = Calls.getCommandUri("notifier/play/");
    return Calls.call("POST", uri, dtoIn);
  },

  loadFireplace(dtoIn) {
    let uri = Calls.getCommandUri("boiler/get/");
    return Calls.call("GET", uri, dtoIn);
  },
};

export default Calls;
