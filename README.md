# JS-WebServices</br>
O  <b>Java Script</b> κώδικάς που μπαίνει στον <b>Advanced Javascript Editor</b> μπορεί να κληθεί αφενός από customization μέσα από το πρόγραμμα (π.χ. από τις προβολές)  αφετέρου απ΄έξω με την μορφή <b>REST Web Service.</b></br>
</br>
1). Για να κληθεί μέσα από μια προβολή κάνουμε include με το όνομα του module.
</br></br>
Παράδειγμα:
</br>
<b>lib.include("example");</b>
</br></br>
<b>
function ON_CUSTOMER_NAME(){</br>
   example.test(CUSTOMER.NAME); </br>
}</br>
</b>
</br>
Όπου example είναι το όνομα του module από τον Advanced Script Editor.
</br>
</br>

2). Για να κληθεί με την μορφή REST Web Services.
</br></br>
Σε αυτή την περίπτωση το web call θα πρέπει να είναι POST όπου στο URI βάζουμε :</br></br>
   http://<b>[domain]</b>.oncloud.gr/s1services<b>/JS/[module name]/[function name]</b></br>
και στο body με την μορφή raw data τις παραμέτρους σε JSON format.</br>
</br>


</br>
Παράδειγμα:
</br>
Κλήση</br>
http://demo.oncloud.gr/s1services/js/example/getVat</br>
</br>
Row body</br>
{</br>
"clientID":"jhgffjg....kjgkjhg",</br>
"param1": "value1",</br>
"param2": "value2"</br>
}</br></br>


