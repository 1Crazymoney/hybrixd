var Clipboard = clipboard;

receiveAsset = {
  renderAssetDetailsInModal: function (assetID) {
    var asset = R.find(R.propEq('id', assetID))(GL.assets);
    var assetAddress = R.prop('address', asset);
    document.querySelector('#action-receive .modal-receive-currency').innerHTML = assetID.toUpperCase(); // after getting address from hybridd, set data-clipboard-text to contain it
    document.querySelector('#action-receive .modal-receive-addressfrom').innerHTML = assetAddress;
    document.querySelector('#modal-receive-button').setAttribute('data-clipboard-text', document.querySelector('#action-receive .modal-receive-addressfrom').innerHTML); // set clipboard content for copy button to address
    clipboardButton('#modal-receive-button', Clipboard.clipboardSuccess, Clipboard.clipboardError); // set function of the copy button
    document.querySelector('#action-receive .modal-receive-status').setAttribute('id', 'receivestatus-' + assetID);

    mkNewQRCode(assetAddress);
  },
  resetReceiveStatus: function () {
    document.querySelector('#action-receive .modal-receive-status')
      .setAttribute('id', 'receivestatus'); // reset status ID attribute to avoid needless polling
  }
};

function mkNewQRCode (address) {
  var qrCode = document.getElementById('qrcode');

  qrCode.innerHTML = ''; // Remove old QR code. HACKY!!!!

  var code = new QRCode(document.getElementById('qrcode'), {
    text: address,
    width: 160,
    height: 160,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });

  return qrCode;
}