module.exports = {
    android: options => {
        return {
           data: {
                message: options.message,
                type: options.type
           }
        };
    },

    ios: options => {
        return {
            aps: {
                alert: options.message
            },

            type: options.type
        };
    },

    windows: options => {
        return `<toast launch='${options.type}'><visual><binding template=\"ToastGeneric\"><text>${options.message}</text></binding></visual></toast>`;
    }
}