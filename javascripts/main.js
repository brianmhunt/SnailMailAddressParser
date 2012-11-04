$(function () {
    var $in = $("#in"),
        $out = $("#out"),
        smap = window.snailmailaddressparser;

    function update() {
        var obj;

        try {
            obj = smap.parse($in.val());
            $out.text(JSON.stringify(obj, null, 2));
        } catch (err) {
            console.log(err);
            $out.text(err);
        }
    }

    _updater = _.debounce(update, 350);

    $in.keyup(function () {
        _updater();
    });

    $in.keyup();

    $("#version").text(smap.Version);
});
