export class ModalConfig {

    CartNoticeModal = false;
    LoginModal = false;

    openLogin() {
        this.LoginModal = true;
    }

    closeLogin() {
        this.LoginModal = false;
    }

    openCartNotice() {
        this.CartNoticeModal = true;
    }

    closeCartNotice() {
        this.CartNoticeModal = false;
    }

}
