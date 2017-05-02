$(document).ready(() => {

  const addDoc = CodeMirror.fromTextArea(document.getElementById('document'), {
    mode: { name: 'javascript', json: true },
    indentUnit: 2,
    electricChars: true,
    matchBrackets: true,
    lineNumbers: true,
    theme: 'rubyblue',
  });

  $('#editJsonContent').on('shown.bs.modal', function () {
    addDoc.refresh();
    addDoc.focus();
  });

  window.getSingleItem = function () {
    $('#editJsonContentMessages').remove();
    $.ajax({
      type: 'GET',
      url: '/api/item/' + JSON.stringify(eval('('+addDoc.getValue()+')')),
    }).done((data) => {
      $('#editJsonContentForm').append(
        '<div id="editJsonContentMessages" class="alert alert-info">'
         + JSON.stringify(data) + '</div>');
    });
    return true;
  };

  window.batchGetItems = function () {
    $('#editJsonContentMessages').remove();
    $.ajax({
      type: 'GET',
      url: '/api/items/' + JSON.stringify(eval('('+addDoc.getValue()+')')),
    }).done((data) => {
      $('#editJsonContentForm').append(
        '<div id="editJsonContentMessages" class="alert alert-info">'
         + JSON.stringify(data) + '</div>');
    });
    return true;
  };

  window.putSingleItem = function () {
    $('#editJsonContentMessages').remove();
    $.ajax({
      type: 'POST',
      url: '/api/item',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(eval('('+addDoc.getValue()+')')),
    }).done((data) => {
      window.location.reload();
    });
    return true;
  };

  window.batchPutItems = function () {
    $('#editJsonContentMessages').remove();
    $.ajax({
      type: 'POST',
      url: '/api/items',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(eval('('+addDoc.getValue()+')')),
    }).done((data) => {
      window.location.reload();
    });
    return true;
  };

  window.deleteSingleItem = function () {
    $('#editJsonContentMessages').remove();
    $.ajax({
      type: 'DELETE',
      url: '/api/item/' + JSON.stringify(eval('('+addDoc.getValue()+')')),
    }).done((data) => {
      window.location.reload();
    });
    return true;
  };

  window.batchDeleteItems = function () {
    $('#editJsonContentMessages').remove();
    $.ajax({
      type: 'DELETE',
      url: '/api/items/' + JSON.stringify(eval('('+addDoc.getValue()+')')),
    }).done((data) => {
      window.location.reload();
    });
    return true;
  };

  const titles = [
    'Get Single Item',
    'Batch Get Items',
    'Put Single Item',
    'Batch Put Items',
    'Delete Single Item',
    'Batch Delete Items',
  ];
  const opfuncs = [
    getSingleItem,
    batchGetItems,
    putSingleItem,
    batchPutItems,
    deleteSingleItem,
    batchDeleteItems,
  ]
  window.passInfoToModal = function(oper) {
    $('#editJsonContentTitle').html(titles[oper]);
    addDoc.setValue(window.JSONScript[oper]);
    $('#editJsonContentBtn').on('click', opfuncs[oper]);
  }

  window.disableStream = function(tname) {
    $.ajax({
      type: 'PUT',
      url: '/api/table',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
          TableName: tname,
          StreamSpecification: {
              StreamEnabled: false,
          }
      }),
    }).done((data) => {
      window.location.reload();
    });
  }

  window.enableStream = function(tname) {
    $.ajax({
      type: 'PUT',
      url: '/api/table',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
          TableName: tname,
          StreamSpecification: {
              StreamEnabled: true,
              StreamViewType: 'NEW_AND_OLD_IMAGES'
          }
      }),
    }).done((data) => {
      window.location.reload();
    });
  }
});
