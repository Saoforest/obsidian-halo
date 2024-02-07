import { Modal, Setting, requestUrl, Notice } from "obsidian";
import HaloPlugin from "./main";
import { HaloSite } from "./settings";
import i18next from "i18next";
import {ModeType} from "./settings"

export function openSiteEditingModal(
  plugin: HaloPlugin,
  site?: HaloSite,
  index = -1,
): Promise<{ site: HaloSite; index?: number }> {
  return new Promise((resolve, reject) => {
    const modal = new SiteEditingModal(plugin, site, index, (site, index) => {
      resolve({
        site,
        index,
      });
    });
    modal.open();
  });
}

export class SiteEditingModal extends Modal {
  private readonly currentSite: HaloSite;

  constructor(
    private readonly plugin: HaloPlugin,
    private readonly site: HaloSite = {
      name: "",
      url: "",
      token: "",
      default: false,
      publish: true,
      slugStrategy: "generateByTitle",
    },
    private readonly index: number = -1,
    private readonly onSubmit: (site: HaloSite, index?: number) => void,
  ) {
    super(app);

    this.currentSite = Object.assign({}, site);
  }
  onOpen(): void {
    const { contentEl } = this;

    const renderContent = () => {
      contentEl.empty();

      contentEl.createEl("h2", { text: i18next.t("site_editing_modal.title") });

      new Setting(contentEl)
        .setName(i18next.t("site_editing_modal.settings.name.name"))
        .setDesc(i18next.t("site_editing_modal.settings.name.description"))
        .addText((text) =>
          text.setValue(this.currentSite.name).onChange((value) => {
            this.currentSite.name = value;
          }),
        );

      new Setting(contentEl)
        .setName(i18next.t("site_editing_modal.settings.url.name"))
        .setDesc(i18next.t("site_editing_modal.settings.url.description"))
        .addText((text) =>
          text.setValue(this.currentSite.url).onChange((value) => {
            this.currentSite.url = value;
          }),
        );

      new Setting(contentEl)
        .setName(i18next.t("site_editing_modal.settings.token.name"))
        .setDesc(i18next.t("site_editing_modal.settings.token.description"))
        .addText((text) =>
          text.setValue(this.currentSite.token).onChange((value) => {
            this.currentSite.token = value;
          }),
        );

      new Setting(contentEl)
        .setName(i18next.t("site_editing_modal.settings.default.name"))
        .setDesc(i18next.t("site_editing_modal.settings.default.description"))
        .addToggle((toggle) =>
          toggle.setValue(this.currentSite.default).onChange((value) => {
            this.currentSite.default = value;
          }),
        );

        // 添加是否默认发布的选项
        new Setting(contentEl)
        .setName(i18next.t("site_editing_modal.settings.publish.name"))
        .setDesc(i18next.t("site_editing_modal.settings.publish.description"))
        .addToggle((toggle) =>
          toggle.setValue(this.currentSite.publish).onChange((value) => {
            this.currentSite.publish = value;
          }),
        );

        // 添加选择slug策略的选项
        new Setting(contentEl)
        .setName(i18next.t("site_editing_modal.settings.slug_strategy.name"))
        .setDesc(i18next.t("site_editing_modal.settings.slug_strategy.description"))
        .addDropdown((dropdown) => {
          dropdown.addOption("generateByTitle", i18next.t("site_editing_modal.settings.slug_strategy.options.generateByTitle"));
          dropdown.addOption("UUID", i18next.t("site_editing_modal.settings.slug_strategy.options.UUID"));
          dropdown.addOption("shortUUID", i18next.t("site_editing_modal.settings.slug_strategy.options.shortUUID"));
          dropdown.addOption("timestamp", i18next.t("site_editing_modal.settings.slug_strategy.options.timestamp"));
          dropdown.setValue(this.currentSite.slugStrategy || "generateByTitle").onChange((value) => {
            this.currentSite.slugStrategy = value as ModeType;
          });
        })


      new Setting(contentEl)
        .addButton((button) => {
          button.setButtonText(i18next.t("site_editing_modal.settings.validate.button")).onClick(() => {
            button.setDisabled(true);
            button.setButtonText(i18next.t("site_editing_modal.settings.validate.button_validating"));
            requestUrl({
              url: `${this.currentSite.url}/apis/api.console.halo.run/v1alpha1/users/-/permissions`,
              headers: {
                Authorization: `Bearer ${this.currentSite.token}`,
              },
            })
              .then((response) => {
                if (response.json.uiPermissions.includes("system:posts:manage")) {
                  new Notice(i18next.t("site_editing_modal.settings.validate.notice_validated"));
                } else {
                  new Notice(i18next.t("site_editing_modal.settings.validate.error_no_permissions"));
                }
              })
              .catch(() => {
                new Notice(i18next.t("common.error_connection_failed"));
              })
              .finally(() => {
                button.setDisabled(false);
                button.setButtonText(i18next.t("site_editing_modal.settings.validate.button"));
              });
          });
        })
        .addButton((button) =>
          button
            .setButtonText(i18next.t("site_editing_modal.settings.save.button"))
            .setCta()
            .onClick(() => {
              this.onSubmit(this.currentSite, this.index);
              this.close();
            }),
        );
    };

    renderContent();
  }

  onClose(): void {
    const { contentEl } = this;
    contentEl.empty();
  }
}
