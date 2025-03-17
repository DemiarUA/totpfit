import { RenderAddButton } from "./render/totpRenderer";
import { initLoop } from "./render/index/renderer";
import { BasePage } from "@zeppos/zml/base-page";
import { LocalStorage } from "@zos/storage";

const app = getApp();

let waitForFetch = true;

Page(
    BasePage({
        onInit() {
            this.getTOTPData()
                .then((x) => {
                    app._options.globalData.TOTPS = JSON.parse(x) ?? [];
                    
                    let localStorage = new LocalStorage();
                    localStorage.setItem(
                        "TOTPs",
                        JSON.stringify(app._options.globalData.TOTPS)
                    );
                    this.initPage();
                })
                .catch((x) => {
                    console.log(`Init failed: ${x}`);
                    let localStorage = new LocalStorage();
                    app._options.globalData.TOTPS = JSON.parse(
                        localStorage.getItem("TOTPs", null) ?? []
                    );
                    this.initPage();
                });
        },
        build() {
            let fetch = setInterval(() => {
                if (waitForFetch) return;

                clearInterval(fetch);
                const buffer = app._options.globalData.TOTPS;
                if (buffer.length < 1) {
                    RenderAddButton("page/tip");
                } else {
                    initLoop(buffer);
                }
            }, 100);
        },
        initPage() {
            waitForFetch = false;
        },
        getTOTPData() {
            return this.request({
                method: "totps",
            });
        },
    })
);
