# Contributing Guide


Welcome to the **Cosmogenesis Learning Engine** 🌌  
This project is museum-grade and ND-safe. To keep contributions flowing smoothly, please follow these steps when setting up GitHub access.

—

## 1. Git Authentication (HTTPS + personal access tokens)

We use **HTTPS with personal access tokens (PATs)** instead of SSH to simplify pushing workflow files.

### Steps

1. **Create a PAT**
   - Go to: [GitHub → Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
   - Choose **classic** or **fine-grained**
   - Scopes required:
     - ✅ `repo`
     - ✅ `workflow`

circuitum99/
  CONTRIBUTING.md        <— put the big Bot Contract here
  .github/
    pull_request_template.md
  scripts/
    check.sh
    ci.sh
  data/
    correspondences.json
    nodes/
    provenance.json
    
    # ✦ Cathedral of Circuits — Pull Request Checklist ✦

Please confirm all items before merging.  
This project follows **CONTRIBUTING.md** (Bot Contract).  
No GitHub Actions. ND-safe only.

—

### ✅ Required Checks
- [ ] Ran `./scripts/check.sh` locally (ND-safe gate passed)
- [ ] Added/updated node(s) in `data/nodes/*.json`
- [ ] Updated `data/registry.json` with new node IDs
- [ ] Added or extended provenance entries in `data/provenance.json`
- [ ] Extended `data/correspondences.json` without breaking schema
- [ ] All JSON valid (no smart quotes, no tabs, LF endings)

### 🎨 Creative Integrity
- [ ] Layered art sources preserved (no flat SVG-only)
- [ ] ND-safe confirmed (no autoplay, strobe, blink, or flashing)
- [ ] Numerology respected (33 spine, 99 gates, 144 lattice)

### 📜 Provenance & Citations
- [ ] Cited relevant sources (Dee, Agrippa, Fortune, Case, Kunz, Regardie, I Ching, Tibetan, Reiki, Hilma, Tesla, Jung, etc.)
- [ ] Notes added to `docs/annex/` if new research included

### ⚡ Final Review
- [ ] No `.github/workflows/*` created or modified
- [ ] PR description includes context for new/updated nodes
- [ ] PR aligns with **open spiral learning** and trauma-informed design



