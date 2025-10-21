# Xueming Fu - Personal Website

Personal academic website powered by Hugo and the Hugo Academic (Wowchemy) theme.

## Overview

This is a professional academic website featuring:
- Personal biography and research interests
- Publications showcase
- Project portfolio
- Research experience timeline
- Skills and expertise
- Contact information

## Quick Start

### Prerequisites
- Hugo Extended (v0.110.0 or later)
- Git

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/windrise/windrise.github.io.git
cd windrise.github.io
```

2. Start the Hugo development server:
```bash
hugo server -D
```

3. Open your browser and visit `http://localhost:1313`

## Customization Guide

### 1. Update Personal Information

Edit `content/authors/admin/_index.md` to update:
- Your name and title
- Bio and research interests
- Education background
- Social media links
- Email and contact info

### 2. Add Your Publications

Create new publication entries in `content/publication/`:
```bash
hugo new content/publication/my-paper/index.md
```

Edit the generated file with your publication details:
- Title, authors, date
- Journal/conference name
- Abstract and summary
- PDF, code, and other links

### 3. Update Projects

Add project entries in `content/project/`:
```bash
hugo new content/project/my-project/index.md
```

### 4. Modify Experience

Edit `content/home/experience.md` to add your:
- Education history
- Work experience
- Research positions
- Internships

### 5. Update Skills

Edit `content/home/skills.md` to showcase your:
- Technical skills
- Programming languages
- Tools and frameworks
- Research expertise

### 6. Change Theme and Colors

Edit `config/_default/params.yaml` to customize:
- Theme (day/night mode)
- Font family and size
- Color scheme
- Layout options

### 7. Update Navigation Menu

Edit `config/_default/menus.yaml` to modify the navigation bar links.

### 8. Add Your Photo

Replace the avatar image:
```bash
static/img/avatar.jpg
```

## Deployment

### GitHub Pages

1. Push your changes to GitHub:
```bash
git add .
git commit -m "Update personal website"
git push origin main
```

2. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Set source to "GitHub Actions" or "main branch"

3. Your site will be available at: `https://windrise.github.io`

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `hugo --gc --minify`
3. Set publish directory: `public`
4. Deploy!

## File Structure

```
.
├── config/          # Site configuration
│   └── _default/
│       ├── config.yaml   # Main config
│       ├── params.yaml   # Theme parameters
│       ├── menus.yaml    # Navigation menus
│       └── languages.yaml
├── content/         # Your content
│   ├── authors/     # Author profiles
│   ├── home/        # Homepage widgets
│   ├── publication/ # Publications
│   └── project/     # Projects
├── static/          # Static files
│   └── img/         # Images
└── themes/          # Hugo themes
```

## Tips

- **Images**: Add images to `static/img/` or within specific content folders
- **SEO**: Update meta descriptions in `config/_default/params.yaml`
- **Analytics**: Add Google Analytics ID in params.yaml
- **Comments**: Enable Disqus or other comment systems in params.yaml

## Resources

- [Hugo Academic Documentation](https://wowchemy.com/docs/)
- [Hugo Documentation](https://gohugo.io/documentation/)
- [Markdown Guide](https://www.markdownguide.org/)

## License

This website is powered by the [Hugo Academic theme](https://github.com/wowchemy/wowchemy-hugo-themes).

## Contact

For questions or suggestions, please contact: your.email@example.com