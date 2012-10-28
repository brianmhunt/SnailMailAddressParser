$(function () {
    var $in = $("#in"),
        $out = $("#out"),
        smap = window.snailmailaddressparser;

    $in.on("keyup", _.debounce(function () {
        var obj;
        
        try {
            obj = smap.parse($in.val());
            $out.text(JSON.stringify(obj, null, 2));
        } catch (err) {
            console.log(err);
            $out.text(err);
        }
    }, 250));

    $in.keyup();
});
