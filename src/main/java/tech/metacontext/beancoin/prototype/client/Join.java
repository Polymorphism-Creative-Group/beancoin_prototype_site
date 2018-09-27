/*
 * Copyright 2018 Jonathan Chang, Chun-yien <ccy@musicapoetica.org>.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package tech.metacontext.beancoin.prototype.client;

import static j2html.TagCreator.*;
import j2html.tags.DomContent;
import j2html.tags.Tag;
import tech.metacontext.beancoin.common.Settings;

/**
 *
 * @author Jonathan Chang, Chun-yien <ccy@musicapoetica.org>
 */
public class Join extends Template {

  @Override
  public DomContent getHead() {
    return join(
            meta().withCharset("utf-8"),
            meta().withName("viewport").withContent("width=device-width"),
            meta().attr("http-equiv", "X-UA-Compatible").withContent("IE=edge"),
            //
            title(Settings.PROJECT.TITLE + "|" + Settings.PROJECT.ORG),
            link().withRel("stylesheet").withHref("/css/join.css"),
            link().withRel("stylesheet").withHref("/css/responsive.css"),
            //inserted
            script().withSrc("/node_modules/socket.io-client/dist/socket.io.js"),
            script().withSrc("/node_modules/jquery/dist/jquery.min.js"),
            //Java packages
            script().withSrc("/config.js"),
            script().withSrc("/client_js/JoinJS.js")
    );
  }

  @Override
  public DomContent getBody() {
    Tag header, logo, content;

    header = div(h1(Settings.PROJECT.TITLE + "|" + Settings.PROJECT.ORG)).withClass("header");
    logo = null;
    content = null;
    return div(
            header, logo, content,
            script().withSrc("/js/jquery-3.2.1.min.js"),
            script().withSrc("/js/mobile-layout.js")
    ).withClass("mobilewpr");
  }

}
