<script>
$.get("http://sunpiksolar.com/api/get_nonce/?controller=user&method=register", function(data){
  window.nonce = data.nonce;
});
  
window.instapageFormSubmitSuccess = function( form ) {
// get values from form fields

let name = ijQuery( form ).find( 'input[name="'+ base64_encode( 'Name' ) +'"]').val();
let email = ijQuery( form ).find( 'input[name="'+ base64_encode( 'Email' ) +'"]').val();
let phone = ijQuery( form ).find( 'input[name="'+ base64_encode( 'Phone' ) +'"]').val();
let address = ijQuery( form ).find( 'input[name="'+ base64_encode( 'Home Address' ) +'"]').val();
let zipCode = ijQuery( form ).find( 'input[name="'+ base64_encode( 'Zip Code' ) +'"]').val();
let nonce = window.nonce;

const base_url = "http://sunpiksolar.com/api/user/register/"
let api_call_url = base_url + '?username='+ email + '&display_name=' + name + '&email='+ email + '&phone=' + phone + '&nonce=' + nonce + '&description=' + address + ' ' + zipCode + '&insecure=cool';

let redirect_url = ijQuery( form ).find( 'input[name="redirect"]' ).val();
ijQuery( form ).find( 'input[name="redirect"]' ).val(redirect_url + '?uid=' + email + '&zipcode=' + zipCode);

$.get(api_call_url, function(data){
  let uid = data.user_id;
});

}
</script>