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

/**
 *
 * @author Jonathan Chang, Chun-yien <ccy@musicapoetica.org>
 */
public abstract class Template {

   public String role = getClass().getSimpleName().toLowerCase();

   public String render() {
      return html(
              head(getHead()),
              body(getBody())
      ).withLang("zh-TW").render();
   }

   public abstract DomContent getHead();

   public abstract DomContent getBody();
}
