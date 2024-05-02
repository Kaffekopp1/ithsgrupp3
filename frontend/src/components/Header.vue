<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const searchInput = ref(null);
const tmdbId = ref(null);
const importMsg = ref(null);
const emoji = ref(null);
const router = useRouter();
const isLoading = ref(false);
const isDisabled = computed(() => {
  return !searchInput.value
});


function search() {
  if (searchInput.value) {
    router.push('/search/all/' + searchInput.value);
    searchInput.value = ''
  }
}

const generateEmoji = () => {
  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
    '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
    '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
    '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓',
    '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦',
    '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞',
    '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿',
    '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖',
    '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈',
    '🙉', '🙊', '💋', '💌', '💘', '💝', '💖', '💗', '💓', '💞',
    '💕', '💟', '❣️', '💔', '❤️', '🧡', '💛', '💚', '💙', '💜',
    '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️',
    '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤', '👋', '🤚', '🖐️',
    '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙',
    '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊',
    '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅',
    '🤳', '💪', '🦾', '🦵', '🦿', '🦶', '👣', '👂', '🦻', '👃',
    '🫀', '🫁', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋',
    '🩸', '🩹', '🩺', '🪑', '🪒', '🦽', '🦼', '🛴', '🛹', '🪄',
    '🪅', '🛷', '🚀', '🛸', '🛎️', '🧳', '⌛', '⏳', '⌚', '⏰',
    '⏱️', '⏲️', '🕰️', '🌡️', '🔍', '🔎', '🔓', '🔒', '🔏', '🔐',
    '🔑', '🗝️', '🔨', '⛏️', '⚒️', '🛠️', '🗡️', '⚔️', '🔫', '🏹',
    '🛡️', '🔧', '🔩', '⚙️', '🗜️', '⚖️', '🦯', '🔗', '⛓️', '🧰',
    '🛠️', '⛏️', '🔩', '⚙️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪',
    '🗡️', '🔱', '🏺', '🗿', '🛏️', '🛋️', '🪑', '🚪', '🛌', '🛏️',
    '🧴', '🚿', '🪒', '🧼', '🪓', '🛁', '🛀', '🪒', '🧻', '🚽',
    '🚾', '🧻', '🧼', '🧽', '🧴', '🪒', '🧹', '🧺', '🧻', '🚽',
    '🚿', '🛁', '🛀', '🛋️', '🚪', '🛏️', '🛌', '🧯', '🔥', '🪵',
    '🪓', '🛢️', '💊', '💉', '🩸', '🦠', '🔬', '🔭', '🧫', '🧪',
    '🧬', '🧴', '🧹', '🧼', '🪒', '🧽', '🧺', '🧻', '🧯', '🛒',
    '🚬', '⚰️', '⚱️', '🗿', '🪦', '🚿', '🚽', '🚰', '🚮', '🚻',
    '🚹', '🚺', '🚼', '🚭', '🅿️', '♿', '🚇', '🚆', '🚈', '🚉',
    '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒',
    '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🚛', '🚜',
    '🏎️', '🏍️', '🛵', '🦽', '🦼', '🛺', '🚲', '🛴', '🚏', '🛣️',
    '🛤️', '🛢️', '⛽', '🚨', '🚥', '🚦', '🛑', '🚧', '⚓', '⛵',
    '🚤', '🛳️', '⛴️', '🛥️', '🚢', '✈️', '🛩️', '🛫', '🛬', '💺',
    '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸', '🌍', '🌎', '🌏',
    '🌐', '🗺️', '🗾', '🧭', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️',
    '🏜️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🧱', '🪨', '🪵', '🛖',
    '🏘️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨',
    '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽',
    '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃',
    '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '🎠', '🎡', '🎢', '💈',
    '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊',
    '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓',
    '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🚛', '🚜',];
  const randomIndex = Math.floor(Math.random() * emojis.length);
  emoji.value = emojis[randomIndex];
};

async function importMovie() {
  try {
    isLoading.value = true;

    setInterval(generateEmoji, 500);

    const importMovie = await fetch(`http://localhost:3000/api/importMovie/${tmdbId.value}`);
    const response = await importMovie.json();
    console.log(response, "KING")
    if (response.success) {
      tmdbId.value = ''
      importMsg.value = 'ALLT GICK BRA !!'
    }
  } catch (e) {
    importMsg.value = e;
  } finally {
    isLoading.value = false;
  }
}


</script>
<template>
  <b-container fluid="lg" class="mt-2 mb-3">
    <b-navbar toggleable="lg" type="white" variant="white">
      <b-navbar-brand to="/" class="fs-3">PCA</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" class="justify-content-between" is-nav>
        <b-navbar-nav class="fs-5 mt-1">
          <b-nav-item to="/">🏠 Hem</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="gap-1">
          <b-nav-form class="gap-1">
            <!-- <b-form-select v-model="selected" :options="searchCategories" required></b-form-select> -->
            <b-form-input class="mr-sm-1" placeholder="Vad vill du söka? 🔎" v-model="searchInput"
              required></b-form-input>
            <b-button variant="primary" class="my-2 my-sm-0" type="submit" @click="search()"
              :disabled="isDisabled">Sök</b-button>
          </b-nav-form>
          <b-button variant="primary" class="my-2 my-sm-0" type="button" v-b-modal.modal-1>✏️</b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </b-container>
  <b-modal id="modal-1" title="Importera en film" hide-footer>
    <div class="d-flex flex-column align-items-center gap-2 text-center" v-if="isLoading">
      <b-spinner label="Loading..."></b-spinner>
      <span class="fs-5">Importerar film {{ emoji }}</span>
    </div>
    <b-row cols="1" class="d-flex flex-column gap-3" v-else>
      <b-col class="d-flex flex-column" v-if="importMsg">
        {{ importMsg }}
      </b-col>
      <b-col class="d-flex flex-column">
        <b-form-input class="mr-sm-1 mb-3" placeholder="The movie database ID behövs 🎭 🎟️" v-model="tmdbId"
          required></b-form-input>
      </b-col>
      <b-col class="d-flex flex-column">
        <div>
          Id:et hittar du <a href="https://themoviedb.org" target="_blank" class="mt-5">HÄR</a>
        </div>
      </b-col>
      <b-col class="d-flex flex-column">
        <b-button variant="primary" class="my-2 my-sm-0" type="button" @click="importMovie()">Importera 🧑‍🎓</b-button>
      </b-col>

    </b-row>
  </b-modal>
</template>

<style scoped></style>
