var setSong = function (songNumber) {
    if (currentSoundFile) {
         currentSoundFile.stop();
     }

    if (songNumber) {
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        currentlyPlayingSongNumber = trackIndex(currentAlbum, currentSongFromAlbum) + 1;
    } else {
        currentSongFromAlbum = null;
        currentlyPlayingSongNumber = null;
    }
    
    if (currentSongFromAlbum) {
        currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
            formats: ['mp3'],
            preload: true
        });
    }

    setVolume(currentVolume);
};

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
};

var setVolume = function(volume) {
    if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function (number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function (songNumber, songName, songLength) {
    var template = 
        '<tr class="album-view-song-item">' +
        '   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
        '   <td class="song-item-title">' + songName + '</td>' +
        '   <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>' +
        '</tr>'
        ;

    var $row = $(template);

    var clickHandler = function () {
	    var $songNumber = parseInt($(this).attr('data-song-number'));

	    if (currentlyPlayingSongNumber !== null) {
		    var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
		    $currentlyPlayingCell.html(currentlyPlayingSongNumber);
	    }

	    if (currentlyPlayingSongNumber !== $songNumber) {
		    $(this).html(pauseButtonTemplate);
		    setSong($songNumber);
            currentSoundFile.play();
            $('.volume .fill').width(currentVolume + '%');
            $('.volume .thumb').css({
                left: currentVolume + '%'
            });
            updateSeekBarWhileSongPlays();
            updatePlayerBarSong();
	    } else if (currentlyPlayingSongNumber === $songNumber) {
            if (currentSoundFile.isPaused()) {
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
            } else {
                currentSoundFile.pause();
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
            }
	    }
    };

    var onHover = function() {
        var $songNumberCell = $(this).find('.song-item-number');
        var $songNumber = parseInt($songNumberCell.attr('data-song-number'));

        if ($songNumber !== currentlyPlayingSongNumber) {
            $songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function() {
        var $songNumberCell = $(this).find('.song-item-number');
        var $songNumber = parseInt($songNumberCell.attr('data-song-number'));

        if ($songNumber !== currentlyPlayingSongNumber) {
            $songNumberCell.html($songNumber);
        }
    };

    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    
    return $row;
};

var setCurrentAlbum = function (album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title').first();
    var $albumArtist = $('.album-view-artist').first();
    var $albumReleaseInfo = $('.album-view-release-info').first();
    var $albumImage = $('.album-cover-art').first();
    var $albumSongList = $('.album-view-song-list').first();

    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty();

    for (var i =0;i<album.songs.length;i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var updateSeekPercentage = function ($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({
        left: percentageString
    });
};

var setupSeekBars = function () {
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function (event) { 
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;

        if ($(this).parent().hasClass('seek-control')) {
            seek(currentSongFromAlbum.duration * seekBarFillRatio);
        } else if ($(this).parent().hasClass('volume')) {
            setVolume(seekBarFillRatio * 100);
        }

        updateSeekPercentage($(this), seekBarFillRatio);
     });

     $seekBars.find('.thumb').mousedown(function(event) {
        var $seekBar = $(this).parent();
 
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;

            if ($seekBar.parent().hasClass('seek-control')) {
                seek(currentSongFromAlbum.duration * seekBarFillRatio);
            } else if ($seekBar.parent().hasClass('volume')) {
                setVolume(seekBarFillRatio * 100);
            }

            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
 
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
 };

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
 
            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(currentSongFromAlbum.duration * seekBarFillRatio);
        });
    }
};

var setCurrentTimeInPlayerBar = function (currentTime) {
    $('.current-time').text(filterTimeCode(currentTime));
};

var setTotalTimeInPlayerBar = function (totalTime) {
    $('.total-time').text(filterTimeCode(totalTime));    
};

var filterTimeCode = function (timeInSeconds) {
    var seconds = parseFloat(timeInSeconds);
    var wholeMinutes = Math.floor(seconds/60);
    var wholeSeconds = Math.round(seconds - wholeMinutes * 60);
    
    if (wholeSeconds < 10) {
        return wholeMinutes + ':0' + wholeSeconds;
    } else {
        return wholeMinutes + ':' + wholeSeconds;
    }
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var nextSong = function () {
    var lastSongNumber = currentlyPlayingSongNumber;
    var nextTrack;
    
    if (currentAlbum.songs[trackIndex(currentAlbum, currentSongFromAlbum) + 1] !== undefined) {
        nextTrack = trackIndex(currentAlbum, currentSongFromAlbum) + 2;
    } else {
        nextTrack = 1;
    }

    setSong(nextTrack);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();

    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function () {
    var lastSongNumber = currentlyPlayingSongNumber;
    var previousTrack; 

    if (currentAlbum.songs[trackIndex(currentAlbum, currentSongFromAlbum) - 1] !== undefined) {
        previousTrack = trackIndex(currentAlbum, currentSongFromAlbum);
    } else {
        previousTrack = currentAlbum.songs.length;
    }

    setSong(previousTrack);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var updatePlayerBarSong = function () {
    var playerBarSongName = currentSongFromAlbum.title,
        playerBarArtistName = currentAlbum.artist;
        playerBarArtistSongMobile = playerBarSongName + ' - ' + playerBarArtistName;

    $('.currently-playing .song-name').text(playerBarSongName);
    $('.currently-playing .artist-song-mobile').text(playerBarArtistSongMobile);
    $('.currently-playing .artist-name').text(playerBarArtistName);
    $('.main-controls .play-pause').html(playerBarPauseButton);

    setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
};

var togglePlayFromPlayerBar = function () {
    if ($playerBarPlayPause.find('span').hasClass('ion-pause')) {
        $(this).html(playerBarPlayButton);
        getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
        currentSoundFile.pause();
    } else {
        if (currentSoundFile) {
            $(this).html(playerBarPauseButton);
            getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
            currentSoundFile.play();
        }
    }
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;

setSong();

var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playerBarPlayPause = $('.main-controls .play-pause');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playerBarPlayPause.click(togglePlayFromPlayerBar);
});
