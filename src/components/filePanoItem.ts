import { ActorAlign } from '@imports/clutter10';
import { EllipsizeMode } from '@imports/pango1';
import { BoxLayout, Icon, Label } from '@imports/st1';
import { FileOperation, FileOperationValue } from '@pano/utils/clipboardManager';
import { registerGObjectClass } from '@pano/utils/gjs';
import { PanoItemTypes } from '@pano/utils/panoItemType';
import { PanoItem } from './panoItem';

@registerGObjectClass
export class FilePanoItem extends PanoItem {
  constructor(content: FileOperationValue, date: Date) {
    super(PanoItemTypes.FILE, date);
    this.body.style_class = [this.body.style_class, 'pano-item-body-file'].join(' ');
    const container = new BoxLayout({
      style_class: 'copied-files-container',
      vertical: true,
      x_expand: true,
      clip_to_allocation: true,
    });
    content.fileList
      .map((f) => {
        const items = f.split('://').filter((c) => !!c);
        return decodeURIComponent(items[items.length - 1]);
      })
      .slice(0, 11)
      .forEach((uri, index) => {
        const bl = new BoxLayout({
          vertical: false,
          style_class: `copied-file-name ${index % 2 === 0 ? 'even' : 'odd'}`,
          x_expand: true,
          x_align: ActorAlign.FILL,
          clip_to_allocation: true,
          y_align: ActorAlign.FILL,
        });
        bl.add_child(
          new Icon({
            icon_name: content.operation === FileOperation.CUT ? 'edit-cut-symbolic' : 'edit-copy-symbolic',
            x_align: ActorAlign.START,
            style_class: 'file-icon',
          }),
        );

        const hasMore = index === 10 && content.fileList.length > 11;

        const uriLabel = new Label({
          text: hasMore ? `...and ${content.fileList.length - index} more` : uri,
          style_class: `pano-item-body-file-name-label ${hasMore ? 'has-more' : ''}`,
          x_align: ActorAlign.FILL,
          x_expand: true,
        });
        uriLabel.clutter_text.ellipsize = EllipsizeMode.MIDDLE;
        bl.add_child(uriLabel);
        container.add_child(bl);
      });
    this.body.add_child(container);
  }
}
