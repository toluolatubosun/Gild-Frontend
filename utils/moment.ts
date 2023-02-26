import moment from "moment";

class Moment {
    // Current dateTime
    getCurrentDateTime() {
        moment.locale();
        return moment().utc().local().format("DD/MM/YYYY LT");
    }

    // convert date to local date
    getDate(date: any) {
        if (!date) return "";

        moment.locale();
        return moment.utc(date).local().format("YYYY-MM-DD");
    }

    // convert date to local date, (string format)
    getDateAlt(date: any) {
        if (!date) return "";

        moment.locale();
        return moment.utc(date).local().format("ll");
    }

    // convert dateTime to local dateTime
    getDateTime(date: any) {
        if (!date) return "";

        moment.locale();
        return moment.utc(date).local().format("DD/MM/YYYY HH:mm");
    }

    // convert dateTime to local dateTime, (html format)
    getDateTimeAlt(date: any) {
        if (!date) return "";

        moment.locale();
        return moment.utc(date).local().format("YYYY-MM-DDTHH:mm");
    }
}

export default new Moment();
