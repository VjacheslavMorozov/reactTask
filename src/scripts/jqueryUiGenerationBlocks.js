import $ from 'jquery';
import datepickerFactory from 'jquery-ui/ui/widgets/datepicker';
import selectmenu from 'jquery-ui/ui/widgets/selectmenu';
import checkboxradio from 'jquery-ui/ui/widgets/checkboxradio';
import dialog from 'jquery-ui/ui/widgets/dialog';

$(function() {
    $('.js-datepicker').datepicker();
    $('.js-radio').checkboxradio();
});

export const openDialog = () => {
    $('.b-popup').dialog()
};

