$(document).ready(() => {

  const addDoc = CodeMirror.fromTextArea(document.getElementById('document'), {
    mode: { name: 'javascript', json: true },
    indentUnit: 2,
    electricChars: true,
    matchBrackets: true,
    lineNumbers: true,
    theme: 'rubyblue',
  });

  $('#addDocument').on('shown.bs.modal', function () {
    addDoc.refresh();
    addDoc.focus();
  });

  window.checkValidJSON = function () {
    $('#documentInvalidJSON').remove();
    $.ajax({
      type: 'POST',
      url: '/api/table',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(eval('('+addDoc.getValue()+')')),
    }).done((data) => {
      window.location.reload();
    });
    return true;
  };

  $('#delete-table').on('click', function () {
    if($('#modal-collection-name').text() == $('#confirmation-input').val()) {
      $.ajax({
        type: 'DELETE',
        url: '/api/table/' + $('#modal-collection-name').text(),
      }).done((data) => {
        window.location.reload();
      });
    }
  });

  window.PassTableInfo = function(name) {
    $('#modal-collection-name').html(name);
  }
});
