function setStarredAssetClass (assetID, isStarred) {
  var id = '#' + assetID.replace(/\./g, '_'); // Mk into function. Being used elsewhere too.
  var addOrRemoveClass = isStarred ? 'add' : 'remove';
  document.querySelector(id + ' > svg').classList[addOrRemoveClass]('starred');
}

function maybeUpdateStarredProp (assetID) {
  return function (acc, asset) {
    var starredLens = R.lensProp('starred');
    var toggledStarredValue = R.not(R.view(starredLens, asset));

    return R.compose(
      R.append(R.__, acc),
      R.when(
        function (a) { return R.equals(R.prop('id', a), assetID); },
        R.set(starredLens, toggledStarredValue)
      )
    )(asset);
  };
}

toggleStar = function (assetID) {
  var globalAssets = GL.assets;
  var updatedGlobalAssets = R.reduce(maybeUpdateStarredProp(assetID), [], globalAssets);
  var isStarred = R.defaultTo(false, R.find(R.propEq('id', assetID, updatedGlobalAssets)));
  var starredForStorage = R.map(R.pickAll(['id', 'starred']), updatedGlobalAssets);

  Storage.Set(userStorageKey('ff00-0035'), userEncode(starredForStorage));
  U.updateGlobalAssets(updatedGlobalAssets);
  setStarredAssetClass(assetID, isStarred);
};
