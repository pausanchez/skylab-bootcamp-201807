// my custom components
'use strict';
function SearchPanel() {
    Component.call(this, 'form');

    var $input = $('<input type="search" placeholder="Input a text...">');
    // Existen otras dos formas pero utilizando var $input = $('<input>');
    // $input.attr('type', 'search');
    // $input.attr({
    //  type: 'search',
    //  placeholder: 'Input a text...'
    // });
    var $button = $('<button type="submit">Search</button>');

    var $element = $(this.element);

    // $element.append ('$input');
    // $element.append ('$button');
    $element.append([$input, $button]);
    

    var _callback;

    this.element.addEventListener('submit', function (event) {
        event.preventDefault();

        var query = $input.val();

        if (query && _callback) _callback(query);
    }.bind(this));

    this.onSearch = function (callback) {
        _callback = callback;
    };
}

SearchPanel.prototype = Object.create(Component.prototype);
SearchPanel.prototype.constructor = SearchPanel;

function ResultsList() {
    Component.call(this, 'ul');

    this.$element= $(this.element);
}

ResultsList.prototype = Object.create(Component.prototype);
ResultsList.prototype.constructor = ResultsList;

ResultsList.prototype.updateResults = function (results) { // => { id, text }
    this.clear();

    $each(results, function (index, result){
    // results.forEach(function (result) {
        var $li= $('<li>');
        var $a= $('<a href="#/' + result.id+'">'+result.text+'</a>');

        $a.click = function () {
            if (this._callback) this._callback(result.id, result.text);
        }.bind(this);

        $li.append($a);
        this.$element.append($li);

    }.bind(this));
};

ResultsList.prototype.clear = function() {
    this.element.innerHTML = '';
};

ResultsList.prototype.onItemClick = function (callback) {
    this._callback = callback;
};

/**
 * 
 * @param {string} title The track title
 * @param {string} image The image URL of the track
 * @param {string} file The file URL of the track
 * @param {string} url The URL of the track
 */
function TrackPlayer(title, image, file, url) {
    Panel.call(this, title, 'section');

    var img = document.createElement('img');
    img.src = image;

    this.element.appendChild(img);

    var audio = document.createElement('audio');
    audio.controls = true;

    var source = document.createElement('source');
    source.src = file;
    source.type = 'audio/mpeg';

    audio.appendChild(source);

    this.element.appendChild(audio);

    var a = document.createElement('a');
    a.href = url;
    a.innerText = 'Open in original player';
    a.target = '_blank';

    this.element.appendChild(a);
}

TrackPlayer.prototype = Object.create(Panel.prototype);
TrackPlayer.prototype.constructor = TrackPlayer;

/**
 * 
 * @param {string} id The track id
 */
function SpotifyPlayer(id) {
    Component.call(this, 'section');

    this.element.innerHTML = '<iframe src="https://open.spotify.com/embed?uri=spotify:track:'+ id +'" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
}

SpotifyPlayer.prototype = Object.create(Component.prototype);
SpotifyPlayer.prototype.constructor = SpotifyPlayer;