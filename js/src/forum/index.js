import app from 'flarum/app';
import ReplyComposer from 'flarum/components/ReplyComposer';
import {extend, override} from 'flarum/extend';
import DiscussionPage from 'flarum/components/DiscussionPage';
import LogInModal from 'flarum/components/LogInModal';
import DiscussionComposer from 'flarum/components/DiscussionComposer';

app.initializers.add('kyrne-composer', () => {
    extend(DiscussionPage.prototype, 'config', function (isInitialized) {
        if (isInitialized) return;

        if ($(window).width() > 768 && app.composer.closed === false && !app.composer.executed) {
            $('.Composer-handle').parent().attr("class", "Composer normal visible");
        }

        if (this.discussion && app.composer.element.classList.length <= 3 && !app.composer.executed) {
            let show = true;
            if (app.session.user) {
                if (!this.discussion.canReply()) {
                    show = false;
                }
            }
            if (show && !app.composer.closed) {
                app.composer.load(new ReplyComposer({
                    user: app.session.user,
                    discussion: this.discussion,
                }));

                app.composer.show();

                if ($(window).width() < 768) {
                    app.composer.minimize();
                    $('.Composer').css({
                        "max-height": '60px'
                    });
                } else {
                    app.composer.changeHeight(100);
                }
                app.composer.closed = true;
            }
        }
    });

    extend(DiscussionPage.prototype, 'onunload', function () {
        app.composer.closed = false;
    });

    extend(ReplyComposer.prototype, 'config', function (isInitialized) {
        if (isInitialized) return;

        let showControls = () => {
            if (!app.session.user) {
                app.modal.show(new LogInModal());
            } else {
                $('.TextEditor-controls').show();
                $('.Composer-handle').parent().attr("class", "Composer normal visible active");
            }
            app.composer.executed = true;
        };

        $('.Composer-controls').children('.item-close').on('click tap', function () {
            app.composer.closed = true;
            $('.composer-backdrop').hide();
        });

        $('.item-minimize').on('click tap', function () {
            app.composer.closed = true;
            $('.composer-backdrop').hide();
        });

        $('.Composer').children().on('blur', ':input', (event) => {
            event.stopImmediatePropagation();
        });

        if (app.composer.component && !app.composer.executed) {
            if ($(window).width() < 768) {
                $(".Composer-content").on('click tap', function () {
                    $('.Composer').css({
                        "max-height": '360px',
                        "height": '360px'
                    });
                    app.composer.show();
                    app.composer.changeHeight(350);
                });
            } else {
                $('.TextEditor-controls').hide();
                $(".Composer-flexible").on('click tap keyup', function () {
                    if (!app.composer.executed) {
                        console.log('hi');
                        showControls();
                        $('.Composer').animate({
                            "height": 230
                        });
                        app.composer.changeHeight(230);
                    }
                });
                $('.item-fullScreen').on('click tap', function () {
                    app.composer.fullScreen();
                    if (!app.composer.executed) {
                        showControls();
                    }
                    $('.Composer-handle').parent().attr("class", "Composer fullScreen visible");
                    m.redraw();
                });
                $('.item-minimize').on('click tap', function () {
                    $('.Composer-handle').parent().attr("class", "Composer minimized visible");
                });
                $(".App-primaryControl").children('.SplitDropdown-button').on('click tap', function () {
                    if (!app.composer.executed) {
                        showControls();
                        $('.Composer').animate({
                            "height": 230
                        });
                        app.composer.changeHeight(230);
                    }
                });
            }
        }
    });

    extend(DiscussionComposer.prototype, 'config', function (isInitialized) {
        if (isInitialized) return;

        app.composer.changeHeight(360);
    });
});
