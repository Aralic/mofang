define('js', [], {
    load: function (resourceId, req, load, config) {
        var script = document.createElement('script');
        script.src = req.toUrl(resourceId);
        script.async = true;
        if (script.readyState) {
            script.onreadystatechange = onload;
        } else {
            script.onload = onload;
        }
        var parent = document.getElementsByTagName('head')[0] || document.body;
        parent.appendChild(script) && (parent = null);
        function onload() {
            var readyState = script.readyState;
            if (typeof readyState == 'undefined' || /^(loaded|complete)$/.test(readyState)) {
                script.onload = script.onreadystatechange = null;
                script = null;
                load(true);
            }
        }
    }
});