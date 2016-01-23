$(document).ready(function() {
    $('#initiative').on('change', function() {
        console.log($(this).val());
        if ($(this).val() === 'Anyone') {
            $('#season').val('Anyone').attr('readonly', 'readonly');
        }
        else {
            $('#season').attr('readonly', false);
        }
    });
});